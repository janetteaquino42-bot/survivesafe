<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Artwork;
use App\Models\Material;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;

class InventoryManagementTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $artist;
    protected $categoryId;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a category first
        $category = \App\Models\Category::factory()->create();
        
        $this->user = User::factory()->create([
            'role' => 'buyer'
        ]);
        
        $this->artist = User::factory()->create([
            'role' => 'seller'
        ]);
        
        $this->categoryId = $category->id;
    }

    /** @test */
    public function artwork_becomes_reserved_when_order_is_created()
    {
        $artwork = Artwork::factory()->create([
            'artist_id' => $this->artist->id,
            'category_id' => $this->categoryId,
            'status' => 'available',
            'price' => 100
        ]);

        // Add to cart
        $cartItem = CartItem::create([
            'user_id' => $this->user->id,
            'product_type' => 'artwork',
            'product_id' => $artwork->id,
            'quantity' => 1,
            'price' => $artwork->price,
        ]);

        // Create address for delivery
        $address = \App\Models\Address::create([
            'user_id' => $this->user->id,
            'label' => 'Test Address',
            'full_name' => 'Test User',
            'phone' => '09123456789',
            'address_line_1' => '123 Test St',
            'city' => 'Test City',
            'province' => 'Test Province',
            'postal_code' => '1234',
            'latitude' => 14.5995,
            'longitude' => 120.9842,
            'full_address' => '123 Test St, Test City, Test Province 1234',
        ]);

        // Create order
        $response = $this->actingAs($this->user)
            ->post('/orders', [
                'cart_item_ids' => [$cartItem->id],
                'address_id' => $address->id,
                'payment_method' => 'cod',
                'subtotal' => 100,
                'shipping_fee' => 200,
                'total_amount' => 300,
            ]);

        // For COD orders, expect a redirect to success page
        $response->assertRedirect(route('orders.success'));
        $response->assertSessionHas('success');

        $artwork->refresh();
        $this->assertEquals('reserved', $artwork->status);
    }

    /** @test */
    public function material_stock_decreases_when_order_is_created()
    {
        $material = Material::factory()->create([
            'artist_id' => $this->artist->id,
            'category_id' => $this->categoryId,
            'stock' => 10,
            'price' => 50
        ]);

        // Add to cart
        $cartItem = CartItem::create([
            'user_id' => $this->user->id,
            'product_type' => 'material',
            'product_id' => $material->id,
            'quantity' => 3,
            'price' => $material->price,
        ]);

        // Create address for delivery
        $address = \App\Models\Address::create([
            'user_id' => $this->user->id,
            'label' => 'Test Address',
            'full_name' => 'Test User',
            'phone' => '09123456789',
            'address_line_1' => '123 Test St',
            'city' => 'Test City',
            'province' => 'Test Province',
            'postal_code' => '1234',
            'latitude' => 14.5995,
            'longitude' => 120.9842,
            'full_address' => '123 Test St, Test City, Test Province 1234',
        ]);

        // Create address for delivery
        $address = \App\Models\Address::create([
            'user_id' => $this->user->id,
            'label' => 'Test Address',
            'full_name' => 'Test User',
            'phone' => '09123456789',
            'address_line_1' => '123 Test St',
            'city' => 'Test City',
            'province' => 'Test Province',
            'postal_code' => '1234',
            'latitude' => 14.5995,
            'longitude' => 120.9842,
            'full_address' => '123 Test St, Test City, Test Province 1234',
        ]);

        // Create order
        $response = $this->actingAs($this->user)
            ->post('/orders', [
                'cart_item_ids' => [$cartItem->id],
                'address_id' => $address->id,
                'payment_method' => 'cod',
                'subtotal' => 150,
                'shipping_fee' => 200,
                'total_amount' => 350,
            ]);

        // For COD orders, expect a redirect to success page
        $response->assertRedirect(route('orders.success'));
        $response->assertSessionHas('success');

        $material->refresh();
        $this->assertEquals(7, $material->stock);
    }

    /** @test */
    public function cannot_add_out_of_stock_material_to_cart()
    {
        $material = Material::factory()->create([
            'artist_id' => $this->artist->id,
            'category_id' => $this->categoryId,
            'stock' => 2,
            'price' => 50
        ]);

        // Try to add more than available stock
        $response = $this->actingAs($this->user)
            ->post('/cart', [
                'product_type' => 'material',
                'product_id' => $material->id,
                'quantity' => 5
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Insufficient stock available.');
    }

    /** @test */
    public function cannot_add_unavailable_artwork_to_cart()
    {
        $artwork = Artwork::factory()->create([
            'artist_id' => $this->artist->id,
            'category_id' => $this->categoryId,
            'status' => 'reserved',
            'price' => 100
        ]);

        $response = $this->actingAs($this->user)
            ->post('/cart', [
                'product_type' => 'artwork',
                'product_id' => $artwork->id,
                'quantity' => 1
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'This artwork is no longer available.');
    }

    /** @test */
    public function inventory_is_restored_on_payment_failure()
    {
        $artwork = Artwork::factory()->create([
            'artist_id' => $this->artist->id,
            'category_id' => $this->categoryId,
            'status' => 'available',
            'price' => 100
        ]);

        $material = Material::factory()->create([
            'artist_id' => $this->artist->id,
            'category_id' => $this->categoryId,
            'stock' => 10,
            'price' => 50
        ]);

        // Add to cart
        $cartItem1 = CartItem::create([
            'user_id' => $this->user->id,
            'product_type' => 'artwork',
            'product_id' => $artwork->id,
            'quantity' => 1,
            'price' => $artwork->price,
        ]);

        $cartItem2 = CartItem::create([
            'user_id' => $this->user->id,
            'product_type' => 'material',
            'product_id' => $material->id,
            'quantity' => 3,
            'price' => $material->price,
        ]);

        // Create address for delivery
        $address = \App\Models\Address::create([
            'user_id' => $this->user->id,
            'label' => 'Test Address',
            'full_name' => 'Test User',
            'phone' => '09123456789',
            'address_line_1' => '123 Test St',
            'city' => 'Test City',
            'province' => 'Test Province',
            'postal_code' => '1234',
            'latitude' => 14.5995,
            'longitude' => 120.9842,
            'full_address' => '123 Test St, Test City, Test Province 1234',
        ]);

        // Create order (will reserve artwork and decrease stock)
        $response = $this->actingAs($this->user)
            ->post('/orders', [
                'cart_item_ids' => [$cartItem1->id, $cartItem2->id],
                'address_id' => $address->id,
                'payment_method' => 'cod',
                'subtotal' => 250, // 100 + 150  
                'shipping_fee' => 200, // Single seller since both are from same artist
                'total_amount' => 450,
            ]);

        // For COD orders, expect a redirect to success page
        $response->assertRedirect(route('orders.success'));
        $response->assertSessionHas('success');

        // Verify inventory changes
        $artwork->refresh();
        $material->refresh();
        $this->assertEquals('reserved', $artwork->status);
        $this->assertEquals(7, $material->stock);

        // Get the created order
        $order = Order::where('buyer_id', $this->user->id)->with('items')->first();

        // Simulate payment failure (restore inventory)
        $orderController = new \App\Http\Controllers\OrderController();
        $reflectionMethod = new \ReflectionMethod($orderController, 'restoreInventory');
        $reflectionMethod->setAccessible(true);
        $reflectionMethod->invoke($orderController, $order);

        // Verify inventory is restored
        $artwork->refresh();
        $material->refresh();
        $this->assertEquals('available', $artwork->status);
        $this->assertEquals(10, $material->stock);
    }
}