# -*- coding: utf-8 -*-
"""
Created on Thu Apr 13 20:05:43 2017

@author: hvivi_000
"""

from functools import reduce
import xlrd
import pandas as pd
import seaborn as sns
import folium
import pygeoj

# Returns a dictionary with the MSA as the key and a list of length 3 as the
# value, containing MSA name, a set of zipcodes, and a set of states,
# in that order.
def msa_data_from_xls(filename):
    book = xlrd.open_workbook(filename)
    sh = book.sheet_by_index(0)
    
    grab_cell = lambda cell: sh.cell_value(rowx=rx, colx=cell)
    msa = {}
    zips = {}
    
    for rx in range(11, sh.nrows):
        this_msa = grab_cell(2)
        zipcode = grab_cell(0)
        
        if(this_msa not in msa):
            msa[this_msa] = set()
        msa[this_msa].add(zipcode)
    
        zips[zipcode] = this_msa
        
    return (msa, zips)

def load_bls(filename):
    xl = pd.ExcelFile(filename)
    sheet = xl.sheet_names[0]
    df = xl.parse(sheet)
    to_keep = ['AREA', 'AREA_NAME', 'TOT_EMP', 'JOBS_1000', 'A_MEAN']
    to_convert = ['TOT_EMP', 'JOBS_1000', 'A_MEAN']
    bls = df.drop(df[df.OCC_CODE != "15-0000"].index)
    bls = bls.drop(bls[(bls.A_MEAN == '*') | (bls.JOBS_1000 == '**') | (bls.TOT_EMP == '**')].index)
    bls[to_convert] = bls[to_convert].apply(pd.to_numeric)
    return bls[to_keep]

# Get dictionaries to convert zip to MSA or MSA to zip
msa_to_zips, zip_to_msa = msa_data_from_xls('data/fs11_gpci_by_msa-zip.xls')

# Load up our bls data from xls files
datafiles = ['data/MSA_M2016_dl.xlsx', 'data/MSA_M2015_dl.xlsx', 'data/MSA_M2014_dl.xlsx']
bls_data = list(map(lambda x: (x[5:9], load_bls(x)), datafiles))

# Rename our columns by year
rename_column = lambda x: x[1].rename(columns={'TOT_EMP': x[0] + '_TOT_EMP',
                                                'A_MEAN': x[0] + '_A_MEAN',
                                                'JOBS_1000': x[0] + '_JOBS_1000'})
bls_data = list(map(rename_column, bls_data))
bls_14, bls_15, bls_16 = bls_data

# Merge 'em all into one dataframe
inner_join_by_area = lambda x, y: pd.merge(x, y, on='AREA', how='inner')
bls_merged = reduce(inner_join_by_area, bls_data)

# Keep only TOT_EMP data, find growth rates, and average them
tot_emp = bls_merged[['AREA', 'AREA_NAME_x', '2016_TOT_EMP', '2015_TOT_EMP', '2014_TOT_EMP']]
tot_emp['2016_EMP_GROWTH'] = tot_emp['2016_TOT_EMP'] - tot_emp['2015_TOT_EMP']
tot_emp['2015_EMP_GROWTH'] = tot_emp['2015_TOT_EMP'] - tot_emp['2014_TOT_EMP']
tot_emp['AVG_EMP_GROWTH'] = (tot_emp['2016_EMP_GROWTH'] + tot_emp['2015_EMP_GROWTH']) / 2

# Drop large negative outliers
tot_emp = tot_emp.drop(tot_emp[tot_emp.AVG_EMP_GROWTH < -10000].index)

tot_emp[['AREA', 'AREA_NAME_x', 'AVG_EMP_GROWTH']].sort_values('AVG_EMP_GROWTH', ascending=False)

# Load set of zips if we have them, return a string if not
def zips_or_null(x):
    try:
        return msa_to_zips[str(x)]
    except KeyError:
        fixed_keys = {19124: '19100', 35084: '35620', 41884: '41860',
                      31084: '31100', 42644: '42660', 47894: '47900',
                      33124: '33100', 22744: '33100', 74804: '14460',
                      71654: '14460', 16974: '16980', 48864: '37980',
                      35004: '35620', 29404: '16980', 77200: '39300',
                      78100: '44140', 76900: '14460', 75700: '35300',
                      73104: '14460', 71950: '14860', 18880: '23020',
                      72400: '15540', 74204: '14460', 76750: '38860',
                      76524: '14460', 74950: '31700', 72850: '14860',
                      23104: '19100', 19804: '19820', 73604: '14460',
                      31740: 31740.0, 15804: '37980', 48424: '33100',
                      76450: '35980', 72104: '14460', 74500: '49340',
                      70900: '12700', 78254: '14460', 78700: '35300',
                      75550: '39300', 16020: 16020.0, 35840: '39460',
                      75404: '31700', 70750: '12620', 31860: 31860.0,
                      79600: '49340', 74650: '30340', 36084: '41860',
                      23844: '16980', 45104: '42660', 73450: '25540'}
        if x in fixed_keys.keys():
            return msa_to_zips[fixed_keys[x]]
        return 'No zips'

tot_emp_zips = tot_emp
tot_emp_zips['ZIPS'] = tot_emp['AREA'].apply(zips_or_null)

# Drop entries without zips
tot_emp_zips = tot_emp_zips.drop(tot_emp_zips[tot_emp_zips.ZIPS == 'No zips'].index)

def dictify_by_zip(data):
    zip_to_avg = {}
    
    for i, row in data.iterrows():
        for zip in row.ZIPS:
            zip_to_avg[zip] = zip_to_avg.get(zip, 0) + row.AVG_EMP_GROWTH
            
    return zip_to_avg
    
zip_to_avg_growth = dictify_by_zip(tot_emp_zips)

geo_path = r'data/zips.json'
geojson = pygeoj.load(filepath=geo_path)

drop = ['ALAND10', 'AWATER10', 'CLASSFP10', 'FUNCSTAT10', 'GEOID10',
        'INTPTLAT10', 'INTPTLON10', 'MTFCC10']
missing_zips = []
for x in range(len(geojson)):
    feature = geojson[x]
    zipcode = feature.properties['ZCTA5CE10']
    if zipcode in zip_to_avg_growth:
        growth = zip_to_avg_growth[zipcode]
        for key in drop:
            if key in feature.properties:
                del geojson[x].properties[key]
        geojson[x].properties['growth'] = growth
    else:
        missing_zips += [x]
        
for idx in reversed(missing_zips):
    del geojson[idx]
        
geojson.save('data/zips_shrank.json')


zipframe = pd.Series(zip_to_avg_growth, name='AVG_EMP_GROWTH')
zipframe.index.name = 'ZIP'
zipframe = zipframe.reset_index()

map = folium.Map(location=[37.769959, -122.448679], tiles='Stamen Toner', zoom_start=7)
map.choropleth(geo_path='data/zips_shrank.json', data=zipframe,
               columns=['ZIP', 'AVG_EMP_GROWTH'],
               key_on='feature.properties.ZCTA5CE10',
               fill_color='RdBu', fill_opacity=0.7, line_opacity=0.2,
               threshold_scale=[-1134, -500, 0, 2000, 5000, 9514],
               legend_name='Avg tech industry job growth (# positions added)')
map.save('avg_emp_growth3.html')

msa_to_avg_growth = {}
for k, v in zip_to_avg_growth.items():
    msa_to_avg_growth[zip_to_msa[k]] = v
    
msaframe = pd.Series(msa_to_avg_growth, name='AVG_EMP_GROWTH')
msaframe.index.name = 'AREA'
msaframe = msaframe.reset_index()

msa_geo_path = r'data/msa.json'
msa_geojson = pygeoj.load(filepath=msa_geo_path)

drop = ['MEMI', 'AWATER', 'MTFCC', 'CSAFP', 'INTPTLAT', 'INTPTLON', 'ALAND',
        'LSAD', 'GEOID', 'NAMELSAD']
        
missing_msas = []
miss_2 = []
for x in range(len(msa_geojson)):
    feature = msa_geojson[x]
    msa = feature.properties['CBSAFP']
    fixes = {'31080': '31100'}
    if msa in fixes:
        msaframe['AREA'].replace(fixes[msa], msa, inplace=True)
        msa = fixes[msa]
    if msa in msa_to_avg_growth:
        growth = msa_to_avg_growth[msa]
        for key in drop:
            if key in feature.properties:
                del msa_geojson[x].properties[key]
        msa_geojson[x].properties['growth'] = growth
    else:
        missing_msas += [x]
        miss_2 += [feature.properties['CBSAFP']]
        
for idx in reversed(missing_msas):
    del msa_geojson[idx]
        
msa_geojson.save('data/msa_shrank.json')

msa_map = folium.Map(location=[37.769959, -122.448679], tiles='Stamen Toner', zoom_start=7)
msa_map.choropleth(geo_path='data/msa_shrank.json', data=msaframe,
             columns=['AREA', 'AVG_EMP_GROWTH'],
             key_on='feature.properties.CBSAFP',
             fill_color='RdBu', fill_opacity=0.7, line_opacity=0.2,
             threshold_scale=[-1134, -500, 0, 2000, 5000, 9514],
             legend_name='Avg tech industry job growth (# positions added)')
msa_map.save('avg_emp_growth_msa.html')

