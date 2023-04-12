import openai
import os
openai.api_key = os.getenv("JEFF_OPENAI_KEY")
import pandas as pd
from lxml import etree
import numpy as np

def generate_completion(prompt, engine='text-davinci-003',temp=0.7,top_p=1,max_tokens=256,freq_pen=0, presence_pen=0, n=1, stop=None):
    '''
        Generic function to generate completion from OpenAI API
    '''
    max_retry = 5
    retry = 0
    while retry < max_retry:
        try:
            response = openai.Completion.create(
                engine=engine,
                prompt=prompt,
                temperature=temp,
                top_p=top_p,
                max_tokens=max_tokens,
                frequency_penalty=freq_pen,
                presence_penalty=presence_pen,
                n = n,
                stop=stop
            )
            return [r.text.strip() for r in response.choices]
        except Exception as e:
            print(e)
            retry += 1
            print("retrying")
            
def generate_completion_chat(messages, model='gpt-4',temp=0.7,top_p=1,max_tokens=256,freq_pen=0, presence_pen=0, n=1, stop=None):
    '''
        Generic function to generate completion from OpenAI API
    '''
    max_retry = 5
    retry = 0
    while retry < max_retry:
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=messages,
                temperature=temp,
                top_p=top_p,
                max_tokens=max_tokens,
                frequency_penalty=freq_pen,
                presence_penalty=presence_pen,
                n = n,
                stop=stop
            )
            return [r['message']['content'] for r in response['choices']]
        except Exception as e:
            print(e)
            retry += 1
            print("retrying")

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
        data.append(row)
    data = pd.DataFrame(data)
    data = data[~data.isnull().any(axis=1)]
    data = data.astype({"begin": float, "end": float, "text": str})
    if merge_time:
        # Merge identical time segments into a single string
        data = data.groupby(["begin", "end"])["text"].apply(lambda x: " ".join(x)).reset_index()
        data["text"] = data["text"].str.strip()

    return data

def df_to_text(df, index=False):
    if index:
        return '\n'.join([f'{i+1}. {row["text"]}' for i, row in df.iterrows()])
    else:
        return '\n'.join([f'{row["text"]}\n' for i, row in df.iterrows()])



