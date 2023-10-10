#%%
import sys, os, datetime
import pandas as pd
#%%
path='/net/projects/templog/data/temp_pizero.log'

df = pd.read_csv(
        path,
        parse_dates=['x'],
        index_col=['x']
    )

#%%
format = "%Y-%m-%d %H:%M:%S.%f"
badrows=[]
for ix in df.index.astype(str):
    try:
        datetime.datetime.strptime(ix, format)
    except ValueError:
        badrows.append(ix)
df=df.drop(badrows)
# print(badrows)

#%%
# df=df.drop(badrows)
# %%
df.index=df.index.astype('datetime64[ns]')