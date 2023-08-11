# # takes filename of datastream as argument
# # appends data older than n days to LF and HF archives
# # truncates stream to data newer than n days
#%%
import sys, os, datetime
import pandas as pd

dpath=sys.argv[1]
#%%
# dpath = '/net/projects/templog/data_test/temp_raspi2.log'
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

#%%
# remove bad dates (too old, or too new)
for path in [pathStream,pathLFarx,pathHFarx]:
    df = pd.read_csv(
        path,
        parse_dates=['x'],
        index_col=['x']
    )
    df.index=df.index.astype('datetime64[ns]')

    df=df.sort_index()
    print('pre',df)

    # set filter dates
    t_old='2021-09-01' # approx start data
    t_new=str(datetime.datetime.now()+datetime.timedelta(1)) # now + 1 day for wiggle room
    
    df=df[(df.index>t_old) & (df.index<t_new)]
    print('post',df)
    df.to_csv(path)
# df[(df.index>t_old) & (df.index<t_new)]


# tnow=datetime.datetime.now()
# xold=(tnow - df.index) > datetime.timedelta(hours=24*7)
# %%
