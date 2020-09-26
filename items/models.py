from django.db import models
from django.contrib.auth import get_user_model


class ItemModel(models.Model):
    owner = models.ForeignKey(get_user_model(),
                              related_name='items',
                              on_delete=models.CASCADE)
    item = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.item
