from django import template
register = template.Library()

@register.filter
def index(array, index):
	return array[index]