from django import template
from decimal import Decimal
import math 
register = template.Library()

@register.filter
def index(array, index):
	return array[index]


@register.filter
def truncate(number, digits) -> Decimal:
    stepper = 10.0 ** digits
    return math.trunc(stepper * float(number)) / stepper