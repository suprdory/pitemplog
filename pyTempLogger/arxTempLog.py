# takes filename of datastream as argument
# appends data older than n days to LF and HF archives
# truncates stream to data newer than n days
import sys, os, datetime
import pandas as pd

dpath=sys.argv[1]

# dpath = '/net/projects/templog/data_testing/temp_raspi.log'
dir=os.path.dirname(dpath)
nameStream= os.path.basename(dpath)
nameParts=nameStream.split('.')
nameLFarx='.'.join((nameParts[0]+'_LFarx',nameParts[1]))
nameHFarx = '.'.join((nameParts[0]+'_HFarx', nameParts[1]))

pathLFarx=os.path.join(dir, nameLFarx)
pathHFarx = os.path.join(dir, nameHFarx)
pathStream = os.path.join(dir, nameStream)
# pathStreamTest = os.path.join(dir, nameStream + '.test')
# print(pathLFarx, pathHFarx, pathStream)

# load stream
df = pd.read_csv(
    pathStream,
    parse_dates=['x'],
    index_col=['x']
)
df.index=df.index.astype('datetime64[ns]')
tnow=datetime.datetime.now()
xold=(tnow - df.index) > datetime.timedelta(hours=24*7)

#create new frames for archiving and cropping stream
df_2HFarx = df[xold].copy()
df_2stream = df[~xold]
df_2LFarx = round(df_2HFarx.resample('60min').mean().ffill(),2)

# check for existing LF archive, load and append new data, or create new.
if os.path.exists(pathLFarx):
    # load stream
    df_LFarx = pd.read_csv(
        pathLFarx,
        parse_dates=['x'],
        index_col=['x']
    )
    df_newLFarx = pd.concat([df_LFarx,df_2LFarx], ignore_index=False)
else:
    df_newLFarx = df_2LFarx

# check for existing HF archive, load and append new data, or create new.
if os.path.exists(pathHFarx):
    # load stream
    df_HFarx = pd.read_csv(
        pathHFarx,
        parse_dates=['x'],
        index_col=['x']
    )
    df_newHFarx = pd.concat([df_HFarx, df_2HFarx], ignore_index=False)
else:
    df_newHFarx = df_2HFarx

# write updates archives
df_newLFarx.to_csv(pathLFarx)
df_newHFarx.to_csv(pathHFarx)
df_2stream.to_csv(pathStream)


