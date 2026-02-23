import json

with open('churn.ipynb', 'r') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if cell['cell_type'] == 'code':
        source_str = ''.join(cell['source'])
        
        if '#label encoding of target column' in source_str:
             cell['source'] = [
                 '#label encoding of target column\n',
                 'df["Churn"] = df["Churn"].map({"Yes": 1, "No": 0})\n',
                 'df.head(2)\n'
             ]

        elif '# Identify columns\nnum_cols =' in source_str:
            cell['source'] = [
                '# Identify columns\n',
                'num_cols = ["tenure", "MonthlyCharges", "TotalCharges"]\n',
                '# Separate features first!\n',
                'X = df.drop(columns=["Churn"])\n',
                'y = df["Churn"]\n\n',
                'cat_cols = X.select_dtypes(include=["object"]).columns\n\n',
                '# One-Hot Encoding\n',
                'X = pd.get_dummies(X, columns=cat_cols, drop_first=True)\n',
                'X.head(2)\n'
            ]

with open('churn.ipynb', 'w') as f:
    json.dump(nb, f)
