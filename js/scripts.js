$(function () {
    //адаптивное меню
    $('.menu_link').toggle(function () {
        $(this).toggleClass('active').next().fadeIn();
    }, function () {
        $(this).toggleClass('active').next().fadeOut();
    });

    // Всплывающие окна
    $('.modal_link').fancybox({
        fitToView: false,
        autoResize: true,
        autoSize: true,
        padding: 0,
        margin: 0,
        maxWidth: '90%'
    });

    $('.fancy_img').fancybox({
        padding: 20,
        margin: 0,
        maxWidth: '90%'
    });

    //Плавный скролинг к якорю
    $('a.scroll').click(function () {
        var selected = $(this).attr('href');
        $.scrollTo(selected, 1000, {offset: 0});
        return false;
    });

    //фильтрация
    // $('#mix_catalog').mixItUp({
    //     selectors: {
    //         target: '.mix',
    //         filter: '.button_filter',
    //     },
    //     animation: {
    //         duration: 410,
    //         effects: 'translateZ(0px) fade',
    //         easing: 'ease'
    //     },
    //     load: {
    //         filter: '.cable'
    //     },
    //     controls: {
    //         toggleFilterButtons: true,
    //     },
    // });

    // Всплывающие окна partners
    $('.open_modal').click(function (e) {
        e.preventDefault();
        var fileName = $(this).attr('data-more');

        $.ajax({
            url: fileName + '.html',
            cache: true,
            dataType: 'html',
            type: "post",
            isLocal: true,
            success: function (html) {
                $('#modal_more').html(html);

                $.fancybox.open('#modal_more', {
                    fitToView: false,
                    autoResize: true,
                    autoSize: true,
                    padding: 0,
                    margin: 0,
                    maxWidth: '100%',
                    maxheight: '100%'
                });
            }
        });
    });

    if ($(window).width() > 1023) {
        $('.first_section').height($(window).height() - 143);
    }
});

$(window).resize(function () {
    if ($(window).width() > 1023) {
        $('.first_section').height($(window).height() - 143);
    }
});

function AjaxFilter() {
    //http://work.melfori.com/Stropy/ajax/goods.json
    var link = "http://work.melfori.com/Stropy/ajax/goods.json";
    // шаблон элемента товаров
    var elemTpl = function (src, title) {
        return "<div class='mix cable goods-item'><div class='thumb'><img src=" + src + "><h3 class='title-goods'>" + title + "</h3></div> <div class='more'><a class='modal_link' id='modal-goods' href='#modal_more'>Подробнее</a></div></div>"
    };

    var staticElem = function (src, title) {
        return "<div class='mix cable'><div class='thumb'><img src=" + src + "><h3 class='title-goods'>" + title + "</h3></div> <div class='more'><a class='modal_link' id='modal-goods' href='#modal_more'>Подробнее</a></div></div>"
    };
    // модалка информации
    var elemModal = function (index, btn) {
        var value = btn.data("filter");

        $.getJSON(link, function (data) {
            var url = data.goods;
            for (var key in url) {
                if (key == value) {
                    var src = data.goods[key];

                    for (var i = 0; i < src.length; i++) {
                        if (i == index) {
                            $("#modal_more .modal-img").attr('src', src[i].img);
                            $("#modal_more .modal-text1").text(src[i].text1);
                            $("#modal_more .modal-text2").text(src[i].text2);
                        }
                    }
                }
            }
            if (value == undefined) {


                var src = url.steel;
                for (var i = 0; i < src.length; i++) {
                    if (i == index) {

                        $("#modal_more .modal-img").attr('src', src[i].img);
                        $("#modal_more .modal-text1").text(src[i].text1);
                        $("#modal_more .modal-text2").text(src[i].text2);
                    }
                }


            }
        })
    };

    // Вывод тех товаров, у которых в свзязной кнопке стоит класс актив
    this.filterReady = function (btn) {
        // Создаем пустой массив для кнопок с классом актив
        var active = [];
        btn.each(function () {
            var className = $(this).attr('class').split(' ');
            for (var i = 0; i < className.length; i++) {
                if (className[i] == 'active') {
                    active.push($(this)); // заворачиваем массив активных кнопок
                }
            }
        });
        // выводим из json эти товары
        $.getJSON(link, function (data) {
            var url = data.goods;
            // перечесляем все кнопки с классом актив и выводим соотвецтвующие товары
            for (var i = 0; i < active.length; i++) {
                var value = active[i].data("filter");

                for (var key in url) {
                    if (key == value) {
                        var src = data.goods[key];
                        for (var j = 0; j < src.length; j++) {

                            $("#mix_catalog .items_mix").append(elemTpl(src[j].img, src[j].title));
                            if (key == 'steel') {

                            }
                        }
                    }
                }


            }
            for (var key in url) {
                if (key == "steel") {
                    url[key].map(function (el) {
                        $("#mix_catalog .statisc-items").append(staticElem(el.img, el.title));
                    })
                }
            }
        }).complete(function () {
            TweenMax.from(".goods-item", 0.7, {y: -30, autoAlpha: 0});
            var i = 0;
            var j = 0;
            $('.goods-item .modal_link').each(function () {
                $(this).attr("num", i);
                i++;
            });
            $('.goods-item .modal_link').click(function () {
                var num = $(this).attr("num");
                elemModal(num, btn);
            });
            $('.statisc-items .modal_link').each(function () {
                $(this).attr("num", j);
                j++;
            });
            $('.statisc-items .modal_link').click(function () {
                var num = $(this).attr("num");

                elemModal(num, $(this));
            })
        })
    };


    // функция вывода товара при нажатии на соответствующую кнопку
    this.filter = function (btn) {
        var value = btn.data("filter");// определяем категорию товара, описанную в data-filter
        $.getJSON(link, function (data) {
            var url = data.goods;

            // удаляем все элементы с товарами
            $('.items_mix .mix').each(function () {
                $(this).remove();
            });

            // перечесляем все ключи товаров из json
            for (var key in url) {
                if (key == value) {
                    var src = data.goods[key];
                    for (var i = 0; i < src.length; i++) {
                        $("#mix_catalog .items_mix").append(elemTpl(src[i].img, src[i].title));
                    }
                }
            }
        }).complete(function () {
            TweenMax.from(".goods-item", 0.7, {y: -30, autoAlpha: 0});
            var i = 0;
            $('.goods-item .modal_link').each(function () {

                $(this).attr("num", i);
                i++;

            });
            $('.goods-item .modal_link').click(function () {
                var num = $(this).attr("num");
                elemModal(num, $(this));
            })
        })
    }

}


function Animation() {
    var tl1 = new TimelineMax(),
        tl2 = new TimelineMax(),
        tl3 = new TimelineMax(),
        tl4 = new TimelineMax(),
        tl5 = new TimelineMax(),
        tl6 = new TimelineMax(),
        tl7 = new TimelineMax(),
        tl8 = new TimelineMax(),
        tl9 = new TimelineMax(),
        tl10 = new TimelineMax(),
        tl11 = new TimelineMax(),
        tl12 = new TimelineMax(),
        tl13 = new TimelineMax(),
        tl14 = new TimelineMax();


    tl1.pause();
    tl2.pause();
    tl3.pause();
    tl4.pause();
    tl5.pause();
    tl6.pause();
    tl7.pause();
    tl8.pause();
    tl9.pause();
    tl10.pause();
    tl11.pause();
    tl12.pause();
    tl13.pause();
    tl14.pause();


    this.someAnim = function () {
        tl1.from('#hd-1', 0.7, {
            x: -100,
            opacity: 0,
            ease: Power4.easeOut
        }, '+=1.3', 'lbl-1')
            .from('#hd-2', 0.7, {x: 100, opacity: 0, ease: Power4.easeOut}, '-=0.5', 'lbl-1');


        tl2.from('.client .title', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-2')
            .staggerFrom('.client .item', 0.7, {y: 10, opacity: 0, ease: Power4.easeOut}, 0.1, 'lbl-2');

        tl3.from('.argument .title', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-3')
            .from('.argument .subtitle', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-3')
            .from('.argument .info', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-3')
            .staggerFrom('.argument .item', 0.7, {y: 10, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-3');

        tl4.from('.secret .title', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-4')
            .staggerFrom('.secret .item .block_icon .number', 0.7, {
                y: -10,
                opacity: 0,
                ease: Power4.easeOut
            }, 0.2, 'lbl-4')
            .staggerFrom('.secret .item .block_icon .icon img', 0.7, {
                x: 10,
                opacity: 0,
                ease: Power4.easeOut
            }, 0.2, 'lbl-4')
            .staggerFrom('.secret .item .text', 0.7, {y: 10, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-4')
            .from('.secret .title_small', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-4')
            .from('.secret .info', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-4')
            .from('.secret .video', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-4');


        tl5.from('#menu3 .title', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-5')
            .from('#menu3 .subtitle', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-5')
            .staggerFrom('#menu3 .item', 0.7, {y: 100, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-5');

        tl6.from('.section_catalog .title', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-6')
            .staggerFrom('.section_catalog #mix_catalog ', 0.7, {
                y: -100,
                opacity: 0,
                ease: Power4.easeOut
            }, 0.2, 'lbl-6')
            .staggerFrom('.section_catalog .button_filter', 0.7, {
                y: 100,
                opacity: 0,
                ease: Power4.easeOut
            }, 0.2, 'lbl-6');


        tl7.from('#anim-form-1 .title', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-7')
            .from('#anim-form-1 .subtitle_form', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-7')
            .staggerFrom('#anim-form-1 .line_form', 0.7, {y: 100, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-7')
            .from('#anim-form-1 .submit', 0.7, {y: 100, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-7')
            .from('#anim-form-1 .text', 0.7, {y: 100, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-7');

        tl8.from('#documentation-2 .title ', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-8')
            .from('#documentation-2 .subtitle ', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-8')
            .staggerFrom('#documentation-2 .item', 0.7, {y: 100, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-8')
            .from('#documentation-2 .text ', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-8');


        tl9.from('.cooperate .title', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-9')
            .from('.cooperate .subtitle', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-9')
            .staggerFrom('.cooperate .item', 0.7, {y: 100, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-9');

        tl10.from('#anim-form-2 .title', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-10')
            .from('#anim-form-2 .subtitle_form', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-10')
            .staggerFrom('#anim-form-2 .line_form', 0.7, {y: 100, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-10')
            .from('#anim-form-2 .submit', 0.7, {y: 100, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-10');

        tl11.from('.cooperation .title', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-11')
            .from('.cooperation .line_form', 0.7, {x: -10, opacity: 0, ease: Power4.easeOut}, 'lbl-11')
            .from('.cooperation .submit', 0.7, {x: -10, opacity: 0, ease: Power4.easeOut}, 'lbl-11')
            .staggerFrom('.cooperation .number', 0.7, {x: -10, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-11')
            .staggerFrom('.cooperation .text', 0.7, {x: 10, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-11');

        tl12.from('#menu5 .title', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-12')
            .from('#menu5 .subtitle', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-12')
            .staggerFrom('#menu5 .item', 0.7, {y: -10, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-12');

        tl13.from('#anim-form-3 .title', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-13')
            .from('#anim-form-3 .subtitle_form', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-13')
            .staggerFrom('#anim-form-3 .line_form', 0.7, {y: 100, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-13')
            .from('#anim-form-3 .submit', 0.7, {y: 100, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-13');

        tl14.from('#menu6 .title', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-14')
            .from('#menu6 .subtitle', 0.7, {y: -100, opacity: 0, ease: Power4.easeOut}, 'lbl-14')
            .staggerFrom('#menu6 .block', 0.7, {y: -10, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-14')
            .staggerFrom('#menu6 .map', 0.7, {y: 10, opacity: 0, ease: Power4.easeOut}, 0.2, 'lbl-14');
    };
    this.play = function () {

        if ($(window).scrollTop() >= 0 && $(window).scrollTop() <= 900) {
            tl1.play();
        }

        if ($(window).scrollTop() >= 500 && $(window).scrollTop() <= 1600) {
            tl2.play();
        }

        if ($(window).scrollTop() >= 1300 && $(window).scrollTop() <= 2200) {
            tl3.play();
        }

        if ($(window).scrollTop() >= 1800 && $(window).scrollTop() <= 2800) {
            tl4.play();
        }
        if ($(window).scrollTop() >= 3100 && $(window).scrollTop() <= 4100) {
            tl5.play();
        }
        if ($(window).scrollTop() >= 4000 && $(window).scrollTop() <= 5100) {
            tl6.play();
        }
        if ($(window).scrollTop() >= 6000 && $(window).scrollTop() <= 6800) {
            tl7.play();
        }
        if ($(window).scrollTop() >= 6500 && $(window).scrollTop() <= 7500) {
            tl8.play();
        }
        if ($(window).scrollTop() >= 7200 && $(window).scrollTop() <= 8100) {
            tl9.play();
        }
        if ($(window).scrollTop() >= 7500 && $(window).scrollTop() <= 8300) {
            tl10.play();
        }
        if ($(window).scrollTop() >= 8500 && $(window).scrollTop() <= 9100) {
            tl11.play();
        }
        if ($(window).scrollTop() >= 9400 && $(window).scrollTop() <= 10700) {
            tl12.play();
        }
        if ($(window).scrollTop() >= 10100 && $(window).scrollTop() <= 10800) {
            tl13.play();
        }
        if ($(window).scrollTop() >= 11000) {
            tl14.play();
        }
    };


}
var anim = new Animation(),
    filterObj = new AjaxFilter();


$(window).scroll(function () {
    if (document.documentElement.clientWidth >= 1200) {
        anim.play();
    }
});


function activeMenuElem(elem) {
    elem.click(function () {
        elem.each(function () {
            if ($(this) != elem) {
                elem.removeClass("active");
            }
        });
        $(this).toggleClass("active");
    });
}

$(document).ready(function () {
    filterObj.filterReady($('.button_filter'));

    if (document.documentElement.clientWidth >= 1200) {
        anim.someAnim();
        anim.play();
    }

    $('.button_filter').click(function () {
        filterObj.filter($(this));
    });
    activeMenuElem($('.button_filter'));


    $("form:not('#form3')").submit(function () { // перехватываем все при событии отправки
        var form = $(this); // запишем форму, чтобы потом не было проблем с this
        var error = [];
        form.find('.modal_form_input').each(function () { // пробежим по каждому полю в форме

            if ($(this).val() == '') { // если находим пустое
                $(this).siblings().show("fade", 500);
                error.push(true); // ошибка
            } else if ($(this).val() !== '') { // если находим не пустое
                $(this).siblings().hide("fade", 500)
                error.push(false); // нет ошибки
            }
            $(this).focus(function () {
                $(this).siblings().hide("fade", 500)
            });

        });
        form.find('.modal_form_phone').each(function () { // пробежим по каждому полю в форме
            var pattern = /^(\+|d+)*\d[\d\(\)\-]{4,14}\d$/;
            if ($(this).val() == '') { // если пустое
                $(this).siblings().show("fade", 500);
                error.push(true); // ошибка 
                if ($(this).siblings().hasClass('input_error_phone')) {
                    $(this).siblings().removeClass('input_error_phone').text("").prepend("Заполните поле<div class='modal_error_triangle'></div><div class='modal_error_chest_img'></div>");
                }
            } else if ($(this).val() !== '') {
                if ($(this).val().match(pattern)) {
                    $(this).siblings().hide("fade", 500);
                    error.push(false); // нет ошибок
                } else {
                    $(this).siblings().show("fade", 500).addClass('input_error_phone').text("").prepend("Введите правильный телефон<div class='modal_error_triangle'></div><div class='modal_error_chest_img'></div>");
                    error.push(true); // ошибка  
                }
            }
            $(this).focus(function () {
                $(this).siblings().hide("fade", 500);
            });

        });
        form.find('.modal_form_email').each(function () { // пробежим по каждому полю в форме
            var pattern = /^(([a-zA-Z0-9]|[!#$%\*\/\?\|^\{\}`~&'\+=-_])+\.)*([a-zA-Z0-9\-]|[!#$%\*\/\?\|^\{\}`~&'\+=-_])+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+$/;
            if ($(this).val() == '') { // если пустое
                $(this).siblings().show("fade", 500);
                error.push(true); // ошибка
                if ($(this).siblings().hasClass('input_error_email')) {
                    $(this).siblings().removeClass('input_error_email').text("").prepend("Заполните поле<div class='modal_error_triangle'></div><div class='modal_error_chest_img'></div>");
                }

            } else if ($(this).val() !== '') {
                if ($(this).val().match(pattern)) {
                    $(this).siblings().hide("fade", 500).removeClass('input_error_email');
                    error.push(false); // нет ошибок
                } else {
                    $(this).siblings().show("fade", 500).addClass('input_error_email').text("").prepend("Введите правильный Email<div class='modal_error_triangle'></div><div class='modal_error_chest_img'></div>");
                    error.push(true); // ошибка  
                }
            }
            $(this).focus(function () {
                $(this).siblings().hide("fade", 500);
            });

        });
        var erorr_finish = 0;
        for (var i = 0; i < error.length; i++) {
            if (error[i] == false) {
                erorr_finish = erorr_finish + 1;
            }
            ;
            // console.log(error[i]);
        }
        //console.log(erorr_finish);


        var size = error.length - 1;
        if (erorr_finish > size) { // в зависимости от полей которые проверяются (в нашем случае 3 поля)
            var data = form.serialize(); // подготавливаем данные
            $.ajax({ // инициализируем ajax запрос
                type: 'POST', // отправляем в POST формате, можно GET
                url: 'mail.php', // путь до обработчика, у нас он лежит в той же папке
                dataType: 'json', // ответ ждем в json формате
                data: data, // данные для отправки
                beforeSend: function (data) { // событие до отправки
                    form.find('input[type="submit"]').attr('disabled', 'disabled'); // например, отключим кнопку, чтобы не жали по 100 раз
                },
                success: function (data) { // событие после удачного обращения к серверу и получения ответа
                    if (data['error']) { // если обработчик вернул ошибку
                        alert(data['error']); // покажем её текст
                    } else { // если все прошло ок

                        if (data['form_type'] == 'modal') {
                            // $('.modal form').hide();
                            // $('.modal .title_pop').hide();
                            //
                            // $('.modal .text-con').hide();
                            // form.trigger('reset');
                            // $('.modal .success_mail').addClass('active'); //пишем что всё ок
                            $.fancybox.open('#pop_up2', {
                                fitToView: false,
                                autoResize: false,
                                autoSize: true,
                                padding: 0,

                            });
                            form.trigger('reset');
                            setTimeout(function () {
                                $.fancybox.close('#pop_up2');
                                // form.parents('.modal').hide("fade", 500);
                                // $('.modal .success_mail').removeClass('active');
                                //$("body").css({ "overflow": "inherit", "padding-right": "0" });
                            }, 3000);
                        }
                        if (data['form_type'] == 'normal') { //надо писать в обычных формах <input type="hidden" name="form_type" value="normal"> 
                            form.trigger('reset');
                            $.fancybox.open('#pop_up2', {
                                fitToView: false,
                                autoResize: false,
                                autoSize: true,
                                padding: 0,

                            });
                            setTimeout(function () {
                                $.fancybox.close('#pop_up2');
                            }, 3000);
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) { // в случае неудачного завершения запроса к серверу
                    alert(xhr.status); // покажем ответ сервера
                    alert(thrownError); // и текст ошибки
                },
                complete: function (data) { // событие после любого исхода
                    form.find('input[type="submit"]').prop('disabled', false); // в любом случае включим кнопку обратно
                }

            });
        }
        return false; // вырубаем стандартную отправку формы
    });
    var files;
    $('input[type=file]').change(function () {
        files = this.files;
        //alert(files);
    });


});
