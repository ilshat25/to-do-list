from django.contrib import admin

from .models import ItemModel


@admin.register(ItemModel)
class ItemAdmin(admin.ModelAdmin):
    fields = ('item', 'owner',)
    list_display = ('item', 'owner',)
