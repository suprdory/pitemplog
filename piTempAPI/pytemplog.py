# %%
import sys, os
import pandas as pd
# import time
# def TicTocGenerator():
#     # Generator that returns time differences
#     ti = 0           # initial time
#     tf = time.time()  # final time
#     while True:
#         ti = tf
#         tf = time.time()
#         yield tf-ti  # returns the time difference
# TicToc = TicTocGenerator()  # create an instance of the TicTocGen generator
# # This will be the main function through which we define both tic() and toc()
# def toc(tempBool=True):
#     # Prints the time difference yielded by generator instance TicToc
#     tempTimeInterval = next(TicToc)
#     if tempBool:
#         print("Elapsed time: %f seconds.\n" % tempTimeInterval)
# def tic():
#     # Records a time in TicToc, marks the beginning of a time interval
#     toc(False)

# %%

def combine2dict():

    dir ='/home/suprdory/data/templog'
    pinames = ['raspi', 'raspi2','audiopi', 'pizero','optitron']
#    pinames = ['optitron']
    fnames_new = ['temp_'+ piname + '.log' for piname in pinames]
    fnames_old = ['temp_' + piname + '_LFarx.log' for piname in pinames]
    dfs=[]
    for fname_new,fname_old,piname in zip(fnames_new,fnames_old,pinames):
        # tic()
                
        print('Reading:', fname_new)
        fpath=os.path.join(dir,fname_new)
        df=pd.read_csv(
            fpath,
            parse_dates=['x'],
            index_col=['x']
        )
        df.index = df.index.astype('datetime64[ns]')
        # toc()
#        print(df.head)
        print('Resampling')
        # Last 15 mins: 15-second resolution (60 points)
        df15m = df.iloc[-15*4:,:].resample('15s').mean().copy()  # base resolution: 1-min samples
        df15m['group'] = piname
        df15m['falseindex'] = 0
        df15m['x'] = df15m.index
        df15m.set_index('falseindex', inplace=True)
        dfs.append(df15m)

        df=df.resample('1min').mean()  # base resolution: 1-min samples
        df['group'] = piname
        # toc()

        # Last 1 hour: 1-min resolution (60 points)
        df1h = df.iloc[-60:-15, :].copy()
        df1h['falseindex'] = 0
        df1h['x'] = df1h.index
        df1h.set_index('falseindex', inplace=True)
        dfs.append(df1h)
        # toc()

        # 1 hour–1 day ago: 5-min resolution (288 points)
        df1d=df.iloc[-1440:-60,:].copy()
        df1d['falseindex'] = 0
        df1d = df1d.resample('5min').mean()
        df1d['group'] = piname
        df1d['x'] = df1d.index
        df1d.set_index('falseindex',inplace=True)
        dfs.append(df1d)
        # toc()

        # 1–7 days ago: 30-min resolution (288 points)
        df7d = df.iloc[-7*1440:-1440, :].copy()
        df7d['falseindex'] = 0
        df7d = df7d.resample('30min').mean()
        df7d['group'] = piname
        df7d['x'] = df7d.index
        df7d.set_index('falseindex', inplace=True)
        dfs.append(df7d)
        # toc()

        # Load LF archive (hourly data for everything older than ~7 days)
        print('Reading:', fname_old)
        fpath = os.path.join(dir, fname_old)
        dfArx = pd.read_csv(
            fpath,
            parse_dates=['x'],
            index_col=['x']
        )
        dfArx.index = dfArx.index.astype('datetime64[ns]')

        tnow = pd.Timestamp.now()
        t_7d = tnow - pd.Timedelta(days=7)
        t_30d = tnow - pd.Timedelta(days=30)

        # 7–30 days ago: 3-hour resolution — from LF archive
        df1m = dfArx[(dfArx.index >= t_30d) & (dfArx.index < t_7d)].copy()
        df1m['falseindex'] = 0
        df1m = df1m.resample('60min').mean()
        df1m['group'] = piname
        df1m['x'] = df1m.index
        df1m.set_index('falseindex', inplace=True)
        dfs.append(df1m)

        # 30+ days ago: 6-hour resolution — from LF archive
        dfe = dfArx[dfArx.index < t_30d].copy()
        dfe['falseindex'] = 0
        dfe = dfe.resample('180min').mean()
        dfe['group'] = piname
        dfe['x'] = dfe.index
        dfe.set_index('falseindex', inplace=True)
        dfs.append(dfe)
        # [print(a.head()) for a in dfs]

    print('Concat all')
    df=pd.concat(dfs,ignore_index=False)
    # Drop rows with missing temperature so vis.js renders gaps instead of zeros.
    df = df.dropna()
    # toc()
    
    print('Convert to dict')
    dfd=df.to_dict(orient='records')
    # toc()

    return(dfd)
# %%
x=combine2dict()
# print(x)
# %%
