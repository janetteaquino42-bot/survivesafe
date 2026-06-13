import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import ImagePreviewModal from '@/Components/Modal/ImagePreviewModal';
import { Shield, Target, Eye, BookOpen, Users, Award, Building, Image } from 'lucide-react';
import { getIcon } from '@/Utils/iconHelper';
import { getColorClasses } from '@/Utils/colorHelper';

export default function About({ hero, mission, vision, history, team, orgStructure, gallery, coreFunctions }) {
    const [previewModal, setPreviewModal] = useState({ isOpen: false, images: [], currentIndex: 0 });

    const openImagePreview = (images, index = 0) => {
        setPreviewModal({ isOpen: true, images, currentIndex: index });
    };

    const closeImagePreview = () => {
        setPreviewModal({ isOpen: false, images: [], currentIndex: 0 });
    };

    const handleImageNavigate = (newIndex) => {
        setPreviewModal(prev => ({ ...prev, currentIndex: newIndex }));
    };

    return (
        <GuestLayout>
            <Head title="About Us - Bacoor DRRMO" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-700 to-slate-600 text-white py-16 overflow-hidden">
                {hero?.images && hero.images.length > 0 && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={`/storage/${hero.images[0]}`}
                            alt="About Hero Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-gray-900/80"></div>
                    </div>
                )}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 line-clamp-2">{hero?.title || 'About Bacoor DRRMO'}</h1>
                    <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto line-clamp-3">
                        {hero?.content || 'Leading disaster risk reduction and management initiatives in Bacoor City'}
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Mission */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 line-clamp-2">Our Mission</h2>
                            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                                {mission?.content || 'To provide effective disaster risk reduction and management services through comprehensive preparedness, rapid response, and community resilience programs that protect the lives and properties of Bacoor citizens.'}
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 line-clamp-2">Our Vision</h2>
                            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                                {vision?.content || 'A disaster-resilient Bacoor City where every citizen is prepared, protected, and empowered to respond effectively to any emergency or calamity.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* History/Background */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <BookOpen className="w-8 h-8 text-blue-600" />
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 line-clamp-2">Our History</h2>
                            </div>
                            <div className="prose prose-sm sm:prose-base md:prose-lg text-gray-700">
                                {history?.content ? (
                                    <p>{history.content}</p>
                                ) : (
                                    <>
                                        <p className="mb-4">
                                            The Bacoor Disaster Risk Reduction and Management Office (BDRRMO) was established in compliance with Republic Act 10121, also known as the Philippine Disaster Risk Reduction and Management Act of 2010.
                                        </p>
                                        <p className="mb-4">
                                            Since its inception, Bacoor DRRMO has been at the forefront of protecting the city's growing population from natural and man-made disasters through comprehensive risk assessment, community preparedness programs, and rapid emergency response capabilities.
                                        </p>
                                        <p>
                                            Today, we continue to strengthen our capacity to serve the citizens of Bacoor through modern technology, trained personnel, and strong partnerships with national and local agencies.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        {history?.images && history.images.length > 0 ? (
                            <div
                                className="rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
                                onClick={() => openImagePreview(
                                    history.images.map((img, idx) => ({
                                        src: `/storage/${img}`,
                                        alt: `History ${idx + 1}`,
                                        caption: idx === 0 ? 'BDRRMO Office Building' : undefined
                                    })),
                                    0
                                )}
                            >
                                <img
                                    src={`/storage/${history.images[0]}`}
                                    alt="BDRRMO Office Building"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-12 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <Building className="w-32 h-32 mx-auto mb-4 opacity-50" />
                                    <p className="font-medium">[History Image Placeholder]</p>
                                    <p className="text-sm text-white/70 mt-2">BDRRMO Office Building</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Core Values or Key Functions */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 line-clamp-2">Core Functions</h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 line-clamp-2">How we serve the community of Bacoor</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {coreFunctions && coreFunctions.length > 0 ? (
                            coreFunctions.map((func, index) => {
                                const colors = ['red', 'blue', 'green', 'purple'];
                                const colorName = func.meta?.color || colors[index % 4];
                                const colorClasses = getColorClasses(colorName);
                                const IconComponent = func.meta?.icon ? getIcon(func.meta.icon) : Shield;
                                return (
                                    <div key={index} className="text-center">
                                        <div className={`${colorClasses.bg} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                            <IconComponent className={`w-10 h-10 ${colorClasses.text}`} />
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">{func.title}</h3>
                                        <p className="text-gray-600 text-sm">{func.content}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <>
                                <div className="text-center">
                                    <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shield className="w-10 h-10 text-red-600" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">Prevention</h3>
                                    <p className="text-gray-600 text-sm">
                                        Identifying and mitigating disaster risks through hazard mapping and risk assessment
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-10 h-10 text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">Preparedness</h3>
                                    <p className="text-gray-600 text-sm">
                                        Training communities and organizing resources for effective disaster response
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Target className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">Response</h3>
                                    <p className="text-gray-600 text-sm">
                                        Rapid deployment of emergency services and rescue operations during disasters
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Award className="w-10 h-10 text-purple-600" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">Recovery</h3>
                                    <p className="text-gray-600 text-sm">
                                        Supporting affected communities in rebuilding and rehabilitation efforts
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Organizational Structure */}
            {orgStructure && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Organizational Structure</h2>
                            <p className="text-xl text-gray-600">Our leadership and team structure</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl p-12 flex items-center justify-center">
                                <div className="text-center">
                                    <Building className="w-24 h-24 mx-auto mb-4 text-gray-500" />
                                    <p className="text-gray-600 font-medium">[Organizational Chart Placeholder]</p>
                                    <p className="text-gray-500 text-sm mt-2">Upload organizational structure diagram</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery Section */}
            {gallery && gallery.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Image className="w-8 h-8 text-blue-600" />
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 line-clamp-2">Gallery</h2>
                            </div>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 line-clamp-2">Moments from Bacoor DRRMO</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {gallery.map((item, index) => (
                                item.images && item.images.length > 0 ? (
                                    item.images.map((image, imgIndex) => {
                                        const allGalleryImages = gallery.flatMap((g, gIdx) =>
                                            g.images ? g.images.map((img, iIdx) => ({
                                                src: `/storage/${img}`,
                                                alt: g.title ? `${g.title} ${iIdx + 1}` : `Gallery ${gIdx + 1}-${iIdx + 1}`,
                                                caption: g.title,
                                                description: g.content
                                            })) : []
                                        );
                                        const globalIndex = gallery.slice(0, index).reduce((acc, g) => acc + (g.images?.length || 0), 0) + imgIndex;

                                        return (
                                            <div
                                                key={`${index}-${imgIndex}`}
                                                className="group cursor-pointer"
                                                onClick={() => openImagePreview(allGalleryImages, globalIndex)}
                                            >
                                                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition">
                                                    <img
                                                        src={`/storage/${image}`}
                                                        alt={item.title ? `${item.title} ${imgIndex + 1}` : `Gallery ${index + 1}-${imgIndex + 1}`}
                                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    {item.title && imgIndex === 0 && (
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                                            <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg line-clamp-2">{item.title}</h3>
                                                            {item.content && (
                                                                <p className="text-white/80 text-xs sm:text-sm mt-1 line-clamp-2">{item.content}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : null
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Team Members */}
            {team && team.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
                            <p className="text-xl text-gray-600">Meet the dedicated professionals serving Bacoor</p>
                        </div>
                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {team.map((member, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 h-48 flex items-center justify-center">
                                        <Users className="w-16 h-16 text-white opacity-50" />
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="font-bold text-lg text-gray-900 mb-1">{member.title}</h3>
                                        <p className="text-blue-600 text-sm font-medium mb-2">
                                            {member.meta?.position || 'Position'}
                                        </p>
                                        {member.content && (
                                            <p className="text-gray-600 text-sm">{member.content}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Image Preview Modal */}
            <ImagePreviewModal
                isOpen={previewModal.isOpen}
                onClose={closeImagePreview}
                images={previewModal.images}
                currentIndex={previewModal.currentIndex}
                onNavigate={handleImageNavigate}
            />
        </GuestLayout>
    );
}
