from collections.abc import Iterable
from typing import TypedDict
from .scrape import get_local_builder_layouts
from . import utils


class Point(TypedDict):
    x: int
    y: int


class Layout(TypedDict):
    layoutImage: str
    linkToBuilder: str
    coordinates: Point
    scale: float


def _does_layout_fit_in_region(layout, region):
    return True


def _is_layout_compliant(layout, build_code):
    return True


def _apply_setbacks(region, build_code):
    return region


def _find_scale(address, layout) -> float:
    return 0.25


def _find_point(region, scale, layout) -> Point:
    return {"x": 0, "y": 0}


def find_layouts(address, build_code, callback) -> Iterable[Layout]:
    region = utils.get_unobstructed_region_ft(address, callback)
    region = _apply_setbacks(region, build_code)
    for _, layout in get_local_builder_layouts(address, callback):
        if layout["image"] is None:
            continue
        if not (
            _is_layout_compliant(layout, build_code)
            and _does_layout_fit_in_region(layout, region)
        ):
            continue
        yield {
            "scale": (scale := _find_scale(address, layout)),
            "coordinates": _find_point(region, scale, layout),
            "linkToBuilder": layout["url"],
            "layoutImage": layout["image"],
        }
