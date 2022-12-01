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

    dir ='/net/projects/templog/data'
    pinames = ['raspi', 'raspi2','audiopi', 'pizero']
    # pinames = ['raspi']
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

        print('Resampling')
        df=df.resample('1min').mean().ffill()
        df['group'] = piname
        # toc()

        df1h = df.iloc[-60:, :].copy()
        df1h['falseindex'] = 0
        df1h['x'] = df1h.index
        df1h.set_index('falseindex', inplace=True)
        dfs.append(df1h)
        # toc()

        df1d=df.iloc[-1440:-60,:].copy()
        df1d['falseindex'] = 0
        df1d = df1d.resample('5min').mean().ffill()
        df1d['group'] = piname
        df1d['x'] = df1d.index
        df1d.set_index('falseindex',inplace=True)
        dfs.append(df1d)
        # toc()

        df7d = df.iloc[-7*1440:-1440, :].copy()
        df7d['falseindex'] = 0
        df7d = df7d.resample('30min').mean().ffill()
        df7d['group'] = piname
        df7d['x'] = df7d.index
        df7d.set_index('falseindex', inplace=True)
        dfs.append(df7d)
        # toc()

        df1m = df.iloc[-30*1440:-7*1440, :].copy()
        df1m['falseindex'] = 0
        df1m = df1m.resample('180min').mean().ffill()
        df1m['group'] = piname
        df1m['x'] = df1m.index
        df1m.set_index('falseindex', inplace=True)
        dfs.append(df1m)
        # toc()

        dfe = df.iloc[:-30*1440, :].copy()
        dfe['falseindex'] = 0
        dfe = dfe.resample('360min').mean().ffill()
        dfe['group'] = piname
        dfe['x'] = dfe.index
        dfe.set_index('falseindex', inplace=True)
        dfs.append(dfe)
        # toc()

        print('Reading:', fname_old)
        fpath = os.path.join(dir, fname_old)
        dfArx = pd.read_csv(
            fpath,
            parse_dates=['x'],
            index_col=['x']
        )
        dfArx['falseindex'] = 0
        dfArx = dfArx.resample('360min').mean().ffill()
        dfArx['group'] = piname
        dfArx['x'] = dfArx.index
        dfArx.set_index('falseindex', inplace=True)
        
        dfs.append(dfArx)
        # [print(a.head()) for a in dfs]

        # toc()

    print('Concat all')
    df=pd.concat(dfs,ignore_index=False)
    # toc()
    
    print('Convert to dict')
    dfd=df.to_dict(orient='records')
    # toc()

    return(dfd)
# %%
x=combine2dict()
# print(x)
# %%
