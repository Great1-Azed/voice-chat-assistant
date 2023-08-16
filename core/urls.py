from django.urls import path, include

from core import views


urlpatterns = [
    path('',views.index, name="index"),
    path('google',views.google),
    path('upload-audio', views.processAudio, name="processAudio"),
    path('about_us',views.aboutUS, name= "about-us"),
    path('contact_us',views.contactUS, name= "contact-us"),
    path('blog',views.blogPost, name= "blog-post")

    
]
