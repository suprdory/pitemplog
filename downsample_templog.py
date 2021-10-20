import sys
import pandas as pd

infilename=sys.argv[1]
outfilename=sys.argv[2]

print('Reading:',infilename)
df=pd.read_csv(
    infilename,
    parse_dates=['x'],
    index_col=['x']
)

print('Processing...')
df_1m=df.resample('1min').mean().ffill()

print('Writing:',outfilename)
df_1m.to_csv(outfilename) 
# print(df_1m)