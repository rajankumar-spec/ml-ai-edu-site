# small utilities: nothing fancy here for now


import numpy as np


def make_linear_data(n=50, noise=5, slope=2.0, intercept=5.0):
x = np.linspace(0, 10, n)
y = slope * x + intercept + np.random.normal(scale=noise, size=n)
return {"x": x.tolist(), "y": y.tolist()}