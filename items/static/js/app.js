document.addEventListener('DOMContentLoaded', function(){
    // Get csrf token from cookies
    const csrftoken = Cookies.get('csrftoken');
    
    // Add csrf token to ajax request header
    $.ajaxSetup({
        beforeSend: function(xhr, settings){
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
    });
    
    /* 
    On submiting the form, send the POST ajax
    request to server and after successfull submission
    display the object.
    */
    $('#add-form').submit(function(e) {
        e.preventDefault();
        
        $('#no-items').addClass('hide');
        
        // Data to request
        let serializedData = $(this).serialize();
        
        $.ajax({
            type: 'POST',
            url: '/items/add/',
            data: serializedData,
            success: function (response) {
                // Check the status of response
                if (response.status == 'ok') {
                    const instances = JSON.parse(response.instances)
                    
                    // For each instance 
                    for (let i=0; i < instances.length; ++i) {
                        const instance = instances[i]
                        // Get item an pk fields from new ItemModel
                        const item = instance.fields.item;
                        const pk = instance.pk;
                        // Timeout to add list-item one by one
                        setTimeout(function(){
                            // Append list-item with new data populated
                            $('.list-items').append(
                                `<li class="list-item added" data-pk="${pk}">
                                    <p>${item}</p>
                                    <div class="item-controler">
                                        <a href="#" data-pk="${pk}" class="btn btn-done">Done</a>
                                    </div>
                                </li>`
                            );
                            // Add ajax request on done click event
                            $(`.btn-done[data-pk="${pk}"]`).click(doneAjax)                                
                            // Remove added class animation
                            $(`.list-item[data-pk="${pk}"]`).on('animationend', function(){
                                $(this).removeClass('added');
                            });
                        }, 400 * i);
                    }
                    // Clear input
                    $('#add-form')[0].reset();
                }
            },
            error: function (response) {
                // response = response.responseJSON;
                // alert(response.error);
            }
        });
    });
    
    /*
    On clicking on done button, send the POST ajax
    request and after success remove object from view
    */
    $('.btn-done').click(doneAjax);
    
    function doneAjax(e) {
        e.preventDefault();
        
        // Get pk of ItemModel from data attribute
        const pk = this.dataset.pk;
        
        $.ajax({
            type: 'POST',
            url: `/items/done/${pk}/`,
            data: {pk: pk},
            success: function(response) {
                if (response.status == 'ok'){
                    // List item to remove
                    let list_item = $(`.btn-done[data-pk=${pk}]`).parent().parent();
                    // start remove animation
                    list_item.addClass('removed');
                    // Remove after animation ends
                    setTimeout(function(){
                        list_item.remove();
                    }, 400);
                }
            },
            error: function(response) {
                // response = response.responseJSON;
                // alert(response.error);
            }
        });
    }

    // Sortable list
    $('.list-items').sortable({
        start: function(event, ui) {
            console.log(event);
        },
        stop: function(event, ui) {
            data = {order: {}};
            $(this).children().each(function(){
                // Associate the module's pk with its order
                data.order[$(this).data('pk')] = $(this).index();
            });
            console.log(data);
            console.log(JSON.stringify(data));
            // items_order = JSON.stringify(items_order)
            $.ajax({
                type: 'POST',
                url: '/items/reorder/',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(data)
            });
        }
    });
});