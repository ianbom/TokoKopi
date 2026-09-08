<?php

use Inertia\Testing\AssertableInertia as Assert;

it('renders the public location page', function () {
    $this->get('/location')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('location'));
});
