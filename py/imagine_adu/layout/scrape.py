import os
import json
import requests

from bs4 import BeautifulSoup


URL_TEMPLATE = "https://adubuildingplans.com/properties/construction/adu-construction-plan-ld-{id}/"
IMAGE_PATH = os.environ["IMAGE_DIR"]
IMAGE_TEMPLATE = "LD-{id}-plan-f.transparent.png"

with open(os.path.join(IMAGE_PATH, "adus.json")) as f:
    _JSON_DATA = json.loads(f.read())


def _format_key(key: str) -> str:
    key = key.lower().split()
    key = "".join(key[:1] + [s.capitalize() for s in key[1:]])
    return key


def _format_value(val: str) -> dict:
    lines = val.splitlines()
    lines = [line.split(":", 1) for line in lines]
    lines = [tuple(s.strip() for s in line) for line in lines]
    if any(len(line) == 1 for line in lines):
        return sum(map(list, lines), [])
    else:
        return {_format_key(key): val for key, val in lines}


def _format_properties(rows):
    properties = {}
    for row in rows:
        td = row.find_all("td")
        key = _format_key(td[0].text)
        val = _format_value(td[1].text)
        properties[key] = val
    return properties


def _get_layout_properties(url):
    response = requests.get(url)
    if response.status_code != 200:
        return None
    soup = BeautifulSoup(response.text, "html.parser")
    rows = soup.find("tbody").find_all("tr")
    return _format_properties(rows)


# TODO: scrape images and crop in real time
# def get_local_builder_layouts(address, callback):
#     for id in range(1901, 1916):
#         url = URL_TEMPLATE.format(id=id)
#         image = IMAGE_FORMAT.format(id=id)
#         if not os.path.exists(image):
#             continue
#         callback(f"scraping: {url}")
#         result = _get_layout_properties(url)
#         if result is None:
#             print(f"WARNING: could not get properties of {id}")
#         result["image"] = image
#         result["url"] = url
#         yield id, result


def get_local_builder_layouts(address, callback):
    for id in range(1901, 1916):
        url = URL_TEMPLATE.format(id=id)
        image = IMAGE_TEMPLATE.format(id=id)
        image = os.path.join(IMAGE_PATH, image)
        if not os.path.exists(image):
            callback(f"missing image for layout: {id} @ {image}")
            continue
        callback(f"scraping: {url}")
        result = _JSON_DATA.get(str(id)).copy()
        result["image"] = image
        result["url"] = url
        yield id, result
