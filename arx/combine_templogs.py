import sys, os
import pandas as pd

# fnames=sys.argv[1:]
dir='/home/suprdory/projects/webplotter'

fnames=[
    'temp_audiopi_1min.csv',
    'temp_pizero_1min.csv',
    'temp_raspi_1min.csv',
    'temp_raspi2_1min.csv',
    ]
groupnames=['audiopi','pizero','raspi','raspi2']
print(fnames)

dfs=[]
for fname,groupname in zip(fnames,groupnames):
    print('Reading:', fname)
    fpath=os.path.join(dir,fname)
    df=pd.read_csv(
        fpath,
        parse_dates=['x'],
        # index_col=['x']
    )
    df=df.iloc[-200:,:]
    # print(df)
    df['group']=groupname
    dfs.append(df)

df=pd.concat(dfs,ignore_index=True)

df.to_json('combined.json',index=True,orient='records',date_format='iso',date_unit='s')
# dfd=df.to_dict(orient='records')
# dfd.
# print('Processing...')
# df_1m=df.resample('1min').mean().ffill()

# print('Writing:',outfilename)
# df_1m.to_csv(outfilename) 
# # print(df_1m)