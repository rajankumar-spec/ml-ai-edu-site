# Utility to generate sample data if you want to create JSON files on the backend
import json
from backend.utils import make_linear_data


if __name__ == '__main__':
    d = make_linear_data(n=80, noise=5, slope=2.5, intercept=4.0)
    with open('data/sample_linear.json', 'w') as f:
        json.dump(d, f)


