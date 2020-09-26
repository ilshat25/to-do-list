from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.core import serializers
from django.http import JsonResponse

from .models import ItemModel


@login_required
def index_view(request):
    user = request.user
    items = user.items.all()

    return render(request, 'items/index.html', 
                {'items':items})


@require_POST
@login_required
def add_view(request):
    if request.is_ajax():
        user = request.user
        query = request.POST.get('query', '')
        if query and user:
            instances = []
            for item in query.split(','):
                item = item.strip()
                instance = ItemModel.objects.create(item=item, owner=user)
                instances.append(instance)
            ser_instances = serializers.serialize('json', instances)
            return JsonResponse({'status': 'ok',
                                 'instances': ser_instances}, 
                                 status=200)
        else:
            JsonResponse({'error': 'No query'}, status=400)
    
    return JsonResponse({'error': 'Not ajax request'}, status=400)


@require_POST
@login_required
def done_view(request, pk):
    if request.is_ajax():
        try:
            item = get_object_or_404(ItemModel, pk=pk)
            item.delete()
            return JsonResponse({'status': 'ok'}, status=200)
        except:
            return JsonResponse({'error': 'Something went wrong'}, status=400)

    return JsonResponse({'error': 'Not ajax request'}, status=400)