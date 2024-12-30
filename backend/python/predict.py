import sys
import joblib
import numpy as np
import pandas as pd
import json

# Load the saved model
model_path = 'python/best_xgb_model.pkl'  # Update with the correct path if necessary
scaler_path = 'python/scaler.pkl'
best_xgb = joblib.load(model_path)
scaler = joblib.load(scaler_path)

# Read input data from arguments
input_data = json.loads(sys.argv[1])

# Convert the input data to a DataFrame
input_df = pd.DataFrame([input_data])
    
# Normalize the input data using the loaded scaler
columns_to_normalize = ['age', 'ap_hi', 'ap_lo', 'bmi']
input_df[columns_to_normalize] = scaler.transform(input_df[columns_to_normalize])

# Convert to numpy array for prediction
input_array = input_df.values

# Predict the output
prediction = best_xgb.predict(input_array)

# Prepare the output as a dictionary
output = {"prediction": "Has cardiovascular disease" if prediction[0] == 1 else "No cardiovascular disease"}

# Convert the dictionary to a JSON string and print it
print(json.dumps(output))