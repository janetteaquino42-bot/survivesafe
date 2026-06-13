<?php

namespace Database\Seeders;

use App\Models\PageContent;
use Illuminate\Database\Seeder;

class PageContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Note: Upload 'default-hero-0.jpg' to storage/app/public/page-content/ 
     * with an image of the BDRRMO building before running this seeder.
     */
    public function run(): void
    {
        $contents = [
            // Home Page
            [
                'page_key' => 'home',
                'section_key' => 'hero',
                'title' => 'Bacoor Disaster Risk Reduction & Management Office',
                'content' => 'Committed to protecting lives, properties, and promoting disaster resilience in the City of Bacoor, Cavite.',
                'is_active' => true,
                'order' => 1,
                'images' => ['page-content/default-hero-0.jpg', 'page-content/default-home-hero-1.jpg'],
            ],
            [
                'page_key' => 'home',
                'section_key' => 'emergency',
                'title' => 'Emergency Hotline',
                'content' => 'Call us 24/7 for emergency assistance',
                'meta' => [
                    'hotline' => '(046) 417-0727',
                    'national_emergency' => '911',
                ],
                'is_active' => true,
                'order' => 2,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'service_1',
                'title' => 'Emergency Response',
                'content' => '24/7 rapid response team ready to assist during disasters and emergencies across all barangays in Bacoor.',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'service_2',
                'title' => 'Community Preparedness',
                'content' => 'Training programs and drills to educate citizens on disaster preparedness and response protocols.',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'page_key' => 'home',
                'section_key' => 'service_3',
                'title' => 'Hazard Mapping',
                'content' => 'Comprehensive mapping and monitoring of disaster-prone areas to enhance community safety.',
                'is_active' => true,
                'order' => 5,
            ],

            // About Page
            [
                'page_key' => 'about',
                'section_key' => 'hero',
                'title' => 'About Bacoor DRRMO',
                'content' => 'Leading disaster risk reduction and management initiatives in Bacoor City',
                'images' => ['page-content/default-hero-0.jpg'],
                'is_active' => true,
                'order' => 0,
            ],
            [
                'page_key' => 'about',
                'section_key' => 'mission',
                'title' => 'Our Mission',
                'content' => 'To provide effective disaster risk reduction and management services through comprehensive preparedness, rapid response, and community resilience programs that protect the lives and properties of Bacoor citizens.',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'page_key' => 'about',
                'section_key' => 'vision',
                'title' => 'Our Vision',
                'content' => 'A disaster-resilient Bacoor City where every citizen is prepared, protected, and empowered to respond effectively to any emergency or calamity.',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'page_key' => 'about',
                'section_key' => 'history',
                'title' => 'Our History',
                'content' => 'The Bacoor Disaster Risk Reduction and Management Office (BDRRMO) was established in compliance with Republic Act 10121, also known as the Philippine Disaster Risk Reduction and Management Act of 2010. Since its inception, Bacoor DRRMO has been at the forefront of protecting the city\'s growing population from natural and man-made disasters through comprehensive risk assessment, community preparedness programs, and rapid emergency response capabilities. Today, we continue to strengthen our capacity to serve the citizens of Bacoor through modern technology, trained personnel, and strong partnerships with national and local agencies.',
                'is_active' => true,
                'order' => 3,
                'images' => ['page-content/default-about-history.jpeg'],
            ],
            [
                'page_key' => 'about',
                'section_key' => 'gallery',
                'is_active' => true,
                'order' => 4,
                'images' => ['page-content/default-about-history.jpeg', 'page-content/default-about-history.jpeg', 'page-content/default-about-history.jpeg', 'page-content/default-about-history.jpeg'],
            ],

            // Contact Page
            [
                'page_key' => 'contact',
                'section_key' => 'hero',
                'title' => 'Contact Us',
                'content' => 'Get in touch with Bacoor DRRMO for inquiries and assistance',
                'images' => ['page-content/default-hero-0.jpg'],
                'is_active' => true,
                'order' => 0,
            ],
            [
                'page_key' => 'contact',
                'section_key' => 'info',
                'title' => 'Contact Information',
                'content' => 'Get in touch with Bacoor DRRMO',
                'meta' => [
                    'emergency_hotline' => '(046) 417-0727',
                    'telephone' => '(046) 417-0727',
                    'email' => 'bdrrmo@bacoor.gov.ph',
                    'address' => 'BDRRMO Office, City Hall Complex, Bacoor, Cavite',
                ],
                'is_active' => true,
                'order' => 1,
            ],
            [
                'page_key' => 'contact',
                'section_key' => 'hours',
                'title' => 'Office Hours',
                'content' => 'Visit us during office hours',
                'meta' => [
                    'weekdays' => '8:00 AM - 5:00 PM',
                    'saturday' => '8:00 AM - 12:00 PM',
                    'sunday' => 'Closed',
                ],
                'is_active' => true,
                'order' => 2,
            ],
            [
                'page_key' => 'contact',
                'section_key' => 'social',
                'title' => 'Social Media',
                'content' => 'Follow us on social media',
                'meta' => [
                    'facebook' => 'https://facebook.com/bacoordrrmoffice',
                ],
                'is_active' => true,
                'order' => 3,
            ],
            [
                'page_key' => 'contact',
                'section_key' => 'map',
                'title' => 'Office Location Map',
                'content' => 'Find us on the map',
                'embed_code' => '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3863.9205379846217!2d120.96490537510296!3d14.43174278603487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d2148c9c0f6d%3A0xae5c37e0decdaef7!2sCity%20of%20Bacoor%20Disaster%20Risk%20Reduction%20and%20Management%20Office%20(CBDRRMO)!5e0!3m2!1sen!2sph!4v1767009147357!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
                'is_active' => true,
                'order' => 4,
            ],

            // Announcements Page
            [
                'page_key' => 'announcements',
                'section_key' => 'hero',
                'title' => 'Announcements',
                'content' => 'Latest updates and important notices from Bacoor DRRMO',
                'images' => ['page-content/default-hero-0.jpg'],
                'is_active' => true,
                'order' => 0,
            ],

            // Resources/Awareness Page
            [
                'page_key' => 'resources',
                'section_key' => 'hero',
                'title' => 'Resources & Awareness Materials',
                'content' => 'Educational materials and resources for disaster preparedness',
                'images' => ['page-content/default-hero-0.jpg'],
                'is_active' => true,
                'order' => 0,
            ],

            // Announcements Hero
            [
                'page_key' => 'announcements',
                'section_key' => 'hero',
                'title' => 'Announcements & Updates',
                'content' => 'Stay informed with the latest news, alerts, and important notices from Bacoor DRRMO',
                'meta' => null,
                'images' => ['page-content/default-hero-0.jpg'],
                'is_active' => true,
                'order' => 1,
            ],

            // Awareness Materials Hero
            [
                'page_key' => 'awareness_materials',
                'section_key' => 'hero',
                'title' => 'Educational Resources',
                'content' => 'Access valuable disaster preparedness guides, safety protocols, and educational materials',
                'meta' => null,
                'images' => ['page-content/default-hero-0.jpg'],
                'is_active' => true,
                'order' => 1,
            ],

            // Hazard Map Hero
            [
                'page_key' => 'hazard_map',
                'section_key' => 'hero',
                'title' => 'Hazard Map - Verified Incidents',
                'content' => 'Interactive map showing verified disaster incidents in Bacoor City. Stay informed and prepared.',
                'meta' => [
                    'badge_text' => 'Real-Time Monitoring',
                    'badge_icon' => 'AlertTriangle'
                ],
                'images' => ['page-content/default-hero-0.jpg'],
                'is_active' => true,
                'order' => 0,
            ],
        ];

        foreach ($contents as $content) {
            PageContent::updateOrCreate(
                [
                    'page_key' => $content['page_key'],
                    'section_key' => $content['section_key'],
                ],
                $content
            );
        }
    }
}
