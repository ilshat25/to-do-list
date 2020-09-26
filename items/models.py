from django.db import models
from django.contrib.auth import get_user_model

from .fields import OrderField

class ItemModel(models.Model):
    owner = models.ForeignKey(get_user_model(),
                              related_name='items',
                              on_delete=models.CASCADE)
    item = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)

    order = OrderField(blank=True, for_fields=['owner',])

    class Meta:
        ordering = ['owner', 'order']


    def __str__(self):
        return f'{self.owner}:{self.order} {self.item}'
