# takes filename of HFarx as argument
# rebuilds LFarx from HFarx

import sys
import os
# import datetime
import pandas as pd

dpath = sys.argv[1]

# dpath = '/net/projects/templog/data_testing/temp_raspi.log'
dir = os.path.dirname(dpath)
nameStream = os.path.basename(dpath)
nameParts = nameStream.split('.')
nameLFarx = '.'.join((nameParts[0]+'_LFarx_rebuild', nameParts[1]))
nameHFarx = '.'.join((nameParts[0]+'_HFarx', nameParts[1]))

pathLFarx = os.path.join(dir, nameLFarx)
pathHFarx = os.path.join(dir, nameHFarx)

# load HFarx
df = pd.read_csv(
    pathHFarx,
    parse_dates=['x'],
    index_col=['x']
)
df.index=df.index.astype('datetime64[ns]')

df_2LFarx = round(df.resample('60min').mean().ffill(), 2)
df_2LFarx.to_csv(pathLFarx)
