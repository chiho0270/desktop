import re
import time
import random
import asyncio
import requests
from bs4 import BeautifulSoup
from backend.db.connect import create_connection, close_connection

BASE_URL = "https://prod.danawa.com/info/?pcode="
PRODUCT_ID_DATA = [
    	"72471092",
    	"32076077",
    	"56151998",
    	"17535839",
    	"19566122",
    	"13649699",
    	"13486118",
    	"14653847",
    	"13344977",
    	"13276568",
    	"13276304",
    	"69656366",
    	"69656321",
    	"69656300",
    	"19890503",
    	"19890527",
    	"19890605",
    	"75184280",
    	"74970929",
    	"75075386",
    	"76551065",
    	"77086958",
    	"77318726",
    	"78235484",
    	"20312969",
    	"77465684",
    	"27161939",
    	"27507680",
    	"77461292",
    	"77318285",
    	"77461214",
    	"77382623",
    	"69059459",
    	"28799654",
    	"76555685",
    	"28798964",
    	"77790914",
    	"70531547",
    	"62794082",
    	"62794079",
    	"19627934",
    	"21694499",
    	"74254832",
    	"74250974",
    	"34815659",
    	"19903481",
    	"73884041",
    	"73892423",
    	"20324882",
    	"20391572",
]


class DanawaParser:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.productID = [
            {"url": BASE_URL + pid, "id": pid}
            for pid in PRODUCT_ID_DATA
        ]

    async def parse_product(self, url, product_id, connection):
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
        except requests.RequestException:
            print(f"Request failed for {url}")
            return

        soup = BeautifulSoup(response.content, 'html.parser')
        try:
            description = soup.find('meta', attrs={'property': 'og:description'})['content']
            price_match = re.search(r'\d{1,3}(,\d{3})+', description)
            product_price = int(price_match.group().replace(',', '')) if price_match else -1
        except (AttributeError, TypeError):
            print(f"Parsing failed for {url}")
            return

        self.save_product_data(product_id, product_price, connection)
        await asyncio.sleep(random.uniform(5, 8))

    def save_product_data(self, product_id, price, connection):
        try:
            cursor = connection.cursor()
            query = "INSERT INTO price (product_id, price) VALUES (%s, %s) ON DUPLICATE KEY UPDATE price = VALUES(price)" 
            cursor.execute(query, (product_id, price))
            connection.commit()
            print(f"Saved data for product {product_id}: {price}")
        except Exception as e:
            print(f"Error saving data: {e}")