<?php

class LocationCategory extends DataObject
{
    private static $db = array(
        'Name' => 'Varchar(100)',
    );

    private static $has_many = array(
        'Locations' => 'Location',
    );

    private static $belogs_many_many = array(
        'Locators' => 'Locator'
    );

    private static $singular_name = "Category";
    Private static $plural_name = "Categories";

    private static $default_sort = 'Name';
}