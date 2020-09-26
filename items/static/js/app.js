/* 
On submiting the form, send the POST ajax
request to server and after successfull submission
display the object.
*/
$('#add-form').submit(function(e) {
    e.preventDefault();
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
                for (let instance of instances) {
                    // Get item an pk fields from new ItemModel
                    const item = instance.fields.item;
                    const pk = instance.pk;
                    // Append list-item with new data populated
                    $('.list-items').append(
                        `<li class="list-item">
                            <p>${item}</p>
                            <div class="item-controler">
                                <a href="#" data-pk="${pk}" class="btn btn-done">Done</a>
                            </div>
                        </li>`
                    );
                    
                    // Add ajax request on donde click event
                    $(`.btn-done[data-pk="${pk}"]`).click(doneAjax);
                }
                // Clear input
                $('#add-form')[0].reset();
            }
        },
        error: function (response) {
            response = response.responseJSON;
            alert(response.error);
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

    const pk = this.dataset.pk;
    const csrftoken = Cookies.get('csrftoken');

    $.ajaxSetup({
        beforeSend: function(xhr, settings){
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
    });
    
    $.ajax({
        type: 'POST',
        url: `/items/done/${pk}/`,
        data: {pk: pk},
        success: function(response) {
            if (response.status == 'ok')
                $(`.btn-done[data-pk=${pk}]`).parent().parent().remove();
        },
        error: function(response) {
            response = response.responseJSON;
            alert(response.error);
        }
    });
}