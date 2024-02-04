Rectangle = (float, float, float, float)  # x, y, w, h


_GPT4V_RESPONSE = """Based on the aerial image provided, here is an analysis of the layout:
1. Property: The property appears to be a residential lot with a single-family home. The house has a hipped roof with multiple sections, indicating a complex floor plan with possibly several rooms or wings. There is a landscaped area surrounding the house with various trees and shrubs, and the terrain seems to be sloped, as indicated by the terracing on the land.
2. Pool: There is a kidney-shaped pool located to the northwest of the main house. It is surrounded by a paved area, likely for lounging and poolside activities, and is accessible via a curved pathway that leads from the house to the pool area.
3. Driveways: It is not entirely clear from the image where the driveway is located, as the specific access point to the property is not visible. However, there seems to be a paved path leading from the bottom right of the image towards the house, which could be the driveway or a walkway. If it is the driveway, it would be located on the southeast side of the property, leading up to the house.
Please note that without a broader view or additional context, some details about the property, such as the exact location of the driveway or additional structures, may not be accurately determined.
"""


# TODO: query google maps / public records to find lot size
def get_lot_extents_ft(address: str) -> Rectangle:
    pass


def get_unobstructed_region_ft(address: str, callback) -> Rectangle:
    for line in _GPT4V_RESPONSE.splitlines():
        callback(f"GPT-4V: {line}")
