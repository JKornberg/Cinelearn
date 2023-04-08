import openai
import os
openai.api_key = os.getenv("JEFF_OPENAI_KEY")
import pandas as pd
from lxml import etree
import numpy as np

def transcript_to_df(path, merge_time=True):
    # If merge_time is True, then combine same time segments into a single string
    # Parse the XML content
    tree = etree.parse(path)
    root = tree.getroot()
    namespaces = root.nsmap
    # Find all the <p> elements
    p_elements = root.findall(".//tt:p", namespaces)

    # Extract the data from the <p> elements
    data = []
    for p in p_elements:
        text = p.text
        if text == None and len(p) > 0:
            text = p[0].text # Sometimes the text is in a <span> element
        row = {
            "begin": p.attrib["begin"][:-1],
            "end": p.attrib["end"][:-1],
            "text": text
        }
        print(row)
        data.append(row)
    data = pd.DataFrame(data)
    data = data[~data.isnull().any(axis=1)]
    data = data.astype({"begin": float, "end": float, "text": str})
    if merge_time:
        # Merge identical time segments into a single string
        data = data.groupby(["begin", "end"])["text"].apply(lambda x: " ".join(x)).reset_index()
        data["text"] = data["text"].str.strip()

    return data

def df_to_text(df):
    return df["text"].str.cat(sep="\n")



