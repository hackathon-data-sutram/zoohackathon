from lxml import html
import lxml.html as lh
import requests
import re
import pandas as pd
from bs4 import BeautifulSoup as bs
import json
import re
import time
from tqdm import tqdm
import pickle

output=open('data0.pkl','wb')
pickle.dump(['a'],output)
output.close()


header={'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36COOKIE: 5=2; ax=v167-7'}

def create_threads(url):   
    url=url

    responce= requests.get(url,headers=header)

    soup=bs(responce.content,'lxml')

    #a=soup.find_all(class_='thead')

    for link in soup.find_all('a', href=True):
        llink=str(link['href'])
        #print(llink)

        if 'forumdisplay' in llink:
            the=''
            the=str(link['href'])
            if 'http://www.faunaclassifieds.com/forums/' not in the:
                print(the)
                the='http://www.faunaclassifieds.com/forums/'+the
                print(the)
            if the.find('php?s') >= 0 and the not in forums:
                forumscode2.append(link['href'])
        if 'showthread' in llink:
            thre=link['href']
            if 'http://www.faunaclassifieds.com/forums/' not in thre:
                thre='http://www.faunaclassifieds.com/forums/'+thre
            print(thre)
            if str(thre).find('php?t') >= 0 and thre not in threads:
                page_list.append(thre)


def return_list(s):
    s2=re.sub(r'[\n\r\t]',' ', s)
    my_str2=re.sub("\s\s+" , "@#", s2)
    my_str2=my_str2.split('@#')
    return (my_str2)

def extract_data(tr_elements):
    data=[]
    for i in range(2):
        if i==0:
            #print('1111111111')
            s=(str(tr_elements[7].text_content()).split('#1')[1].split('<!--'))[0]
        elif i==1:
           # print('22222222222')
            s=(str(tr_elements[7].text_content()).split('#1')[0])
        data.append(return_list(s))
    return (data)

def thread_data(url):
    data=[]
    responce2= requests.get(url,headers=header)
    soup_thread=lh.fromstring(responce2.content)
    tr_elements=soup_thread.xpath('//tr')
    data=extract_data(tr_elements)
    final_data(data)

data_3=[]
def final_data(data):
    #if data[1][3].find('Sale/Wanted') != -1:
    try:
        data_2=[]
        #user name
        data_2.append(data[0][1])
        #AD name
        data_2.append(data[0][2])
        #Description
        data_2.append(data[0][3])
        #date
        data_2.append(data[1][48])
        #type_1
        data_2.append(data[1][2])
        #type_2
        data_2.append(data[1][3])
        #type_3
        data_2.append(data[1][4])
        #for sale or not
        data_2.append(data[1][5])
        data_3.append(data_2)
    except:
        pass

def save_data(data_3):
    pre=open('data0.pkl','rb')
    pre_data=pickle.load(pre)
    data_dic=pre_data
    pre.close()
    for i in range(len(data_3)-1):
        data_dic.append({
        'User_name':data_3[i][0],
        'AD_name':data_3[i][1],
        'Description':data_3[i][2],
        'Date':data_3[i][3],
        'Type_1':data_3[i][4],
        'Type_2':data_3[i][5],
        'Type_3':data_3[i][6],
        'Sale_or_no':data_3[i][7]  })
    output=open('data0.pkl','wb')
    pickle.dump(data_dic,output)
    output.close()
    data_3=[]

for k in tqdm(range(len(forumcode2))):
    for j in tqdm(range(page_list[k])):
        url = "http://www.faunaclassifieds.com/forums/forumdisplay.php?f="+str(forumcode2[k])+"&order=desc&page="+str(j)
        #print(url)
        time.sleep(2)
        page = bs(requests.get(url).content, 'lxml')
        threads = page.find('tbody', {"id": "threadbits_forum_{}".format(forumcode2[k])}).find_all('tr')
        for i in threads:
            try:
                t = i.find_all('a')[2]
                url1 = "http://www.faunaclassifieds.com/forums/" + t['href']
                thread_data(url1)
            except:
                print(url1)
                pass
        save_data(data_3)
        data_3=[]


