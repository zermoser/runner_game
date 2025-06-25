import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Star,
    Clock,
    MapPin,
    X,
    Check,
    CheckCircle,
    Sparkles,
    Heart,
    Timer,
    Users
} from 'lucide-react';

// Types
interface FoodItem {
    id: number;
    name: string;
    price: number;
    category: 'main' | 'dessert' | 'drink';
    description: string;
    image: string;
    rating: number;
    cookTime: string;
    popular?: boolean;
}

interface CartItem extends FoodItem {
    quantity: number;
}

// Mock Data
const mockFoodData: FoodItem[] = [
    // อาหารหลัก
    {
        id: 1,
        name: 'ข้าวผัดกุ้งพิเศษ',
        price: 120,
        category: 'main',
        description: 'ข้าวผัดกุ้งใหญ่พิเศษ ใส่ไข่ดาว ผักสด',
        image: '🍛',
        rating: 4.8,
        cookTime: '15 นาที',
        popular: true
    },
    {
        id: 2,
        name: 'ผัดไทยโบราณ',
        price: 100,
        category: 'main',
        description: 'ผัดไทยสูตรโบราณ หอมหวานกำลังดี',
        image: '🍜',
        rating: 4.7,
        cookTime: '12 นาที'
    },
    {
        id: 3,
        name: 'ต้มยำกุ้งต้นตำรับ',
        price: 150,
        category: 'main',
        description: 'ต้มยำรสจัดจ้าน กุ้งสด เห็ดฟาง',
        image: '🍲',
        rating: 4.9,
        cookTime: '18 นาที',
        popular: true
    },
    {
        id: 4,
        name: 'แกงเขียวหวานไก่',
        price: 130,
        category: 'main',
        description: 'แกงเขียวหวานหอมกะทิ เนื้อไก่นุ่ม',
        image: '🍛',
        rating: 4.6,
        cookTime: '20 นาที'
    },
    {
        id: 5,
        name: 'ส้มตำไทยแท้',
        price: 80,
        category: 'main',
        description: 'ส้มตำตำสดใหม่ เปรียวหวานเค็ม',
        image: '🥗',
        rating: 4.5,
        cookTime: '8 นาที'
    },

    // ของหวาน
    {
        id: 6,
        name: 'มะม่วงข้าวเหนียว',
        price: 90,
        category: 'dessert',
        description: 'มะม่วงหวานหอม ข้าวเหนียวนุ่ม',
        image: '🥭',
        rating: 4.8,
        cookTime: '5 นาที',
        popular: true
    },
    {
        id: 7,
        name: 'ทับทิมกรอบ',
        price: 70,
        category: 'dessert',
        description: 'ทับทิมกรอบแสนอร่อย เย็นชื่นใจ',
        image: '🍧',
        rating: 4.4,
        cookTime: '3 นาที'
    },
    {
        id: 8,
        name: 'ไอศกรีมกะทิ',
        price: 60,
        category: 'dessert',
        description: 'ไอศกรีมรสกะทิหอมมัน',
        image: '🍨',
        rating: 4.3,
        cookTime: '2 นาที'
    },
    {
        id: 9,
        name: 'บัวลอยน้ำกะทิ',
        price: 50,
        category: 'dessert',
        description: 'บัวลอยสีสวย น้ำกะทิหวานมัน',
        image: '🍡',
        rating: 4.2,
        cookTime: '10 นาที'
    },

    // เครื่องดื่ม
    {
        id: 10,
        name: 'ชาเย็นสูตรพิเศษ',
        price: 40,
        category: 'drink',
        description: 'ชาเย็นหวานมัน สูตรเฉพาะของร้าน',
        image: '🧋',
        rating: 4.6,
        cookTime: '3 นาที'
    },
    {
        id: 11,
        name: 'กาแฟเย็นเข้มข้น',
        price: 50,
        category: 'drink',
        description: 'กาแฟคั่วเข้ม หอมกรุ่น ชื่นใจ',
        image: '☕',
        rating: 4.5,
        cookTime: '4 นาที'
    },
    {
        id: 12,
        name: 'น้ำส้มคั้นสด',
        price: 45,
        category: 'drink',
        description: 'น้ำส้มคั้นสด 100% วิตามินซี',
        image: '🍊',
        rating: 4.4,
        cookTime: '2 นาที',
        popular: true
    },
    {
        id: 13,
        name: 'น้ำมะนาวโซดา',
        price: 35,
        category: 'drink',
        description: 'เปรียวซ่า สดชื่น คลายร้อน',
        image: '🍋',
        rating: 4.3,
        cookTime: '2 นาที'
    }
];

// Enhanced Checkout Modal Component
const CheckoutModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    total: number;
}> = ({ isOpen, onClose, cartItems, total }) => {
    const [step, setStep] = useState(1); // 1: Order Summary, 2: Success Animation
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirmOrder = async () => {
        setIsProcessing(true);

        // Simulate order processing
        setTimeout(() => {
            setIsProcessing(false);
            setStep(2);

            // Auto close after success animation
            setTimeout(() => {
                onClose();
                setStep(1);
            }, 4000);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl transform transition-all duration-300">
                {step === 1 ? (
                    // Order Summary Step
                    <>
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">🧾 ยืนยันคำสั่งซื้อ</h2>
                                    <p className="opacity-90">กรุณาตรวจสอบรายการอาหาร</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Order Items */}
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                        <div className="text-3xl">{item.image}</div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                            <p className="text-sm text-gray-600">฿{item.price} x {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">฿{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Info */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <MapPin size={20} className="text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-800">📍 จัดส่งที่</p>
                                        <p className="text-sm text-gray-600">โต๊ะที่ 12 - ชั้น 2</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Timer size={20} className="text-orange-600" />
                                    <div>
                                        <p className="font-medium text-gray-800">⏱️ เวลาเตรียม</p>
                                        <p className="text-sm text-gray-600">ประมาณ 20-25 นาที</p>
                                    </div>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-800">💰 ยอดรวมทั้งหมด</span>
                                    <span className="text-2xl font-bold text-green-600">฿{total.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-2xl transition-all duration-300"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleConfirmOrder}
                                    disabled={isProcessing}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            <span>กำลังดำเนินการ...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={20} />
                                            <span>ยืนยันสั่งซื้อ</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    // Success Animation Step
                    <div className="p-8 text-center">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <CheckCircle size={48} className="text-white animate-bounce" />
                            </div>
                            <div className="absolute -top-2 -right-2 animate-ping">
                                <Sparkles size={24} className="text-yellow-500" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 mb-2">🎉 สั่งอาหารสำเร็จ!</h2>
                        <p className="text-gray-600 mb-4">ขอบคุณที่ใช้บริการ</p>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl mb-6">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Timer size={24} className="text-orange-500" />
                                <span className="text-lg font-semibold">กำลังเตรียมอาหาร</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full animate-pulse" style={{ width: '30%' }}></div>
                            </div>
                            <p className="text-sm text-gray-600">อาหารจะเสิร์ฟที่โต๊ะ 12 ภายใน 20-25 นาที</p>
                        </div>

                        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Heart size={16} className="text-red-500" />
                                <span>ขอบคุณ</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users size={16} className="text-blue-500" />
                                <span>ครัวคุณมอส</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Enhanced runner_game Header Component
const runner_gameHeader: React.FC = () => {
    return (
        <div className="bg-orange-500 text-white">
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            🍽️ ครัวคุณมอส
                        </h1>
                        <div className="text-sm opacity-90 space-y-1">
                            <div className="flex items-center gap-2">
                                <Star size={14} className="fill-current text-yellow-300" />
                                <span>4.7 (9,241)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                <span>โต๊ะที่ 12</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-xl px-3 py-2">
                        <div className="text-xs opacity-75">Table</div>
                        <div className="text-lg font-bold">12</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced Category Tabs Component
const CategoryTabs: React.FC<{
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}> = ({ activeCategory, onCategoryChange }) => {
    const categories = [
        { id: 'all', name: 'อาหารทั้งหมด', emoji: '📋' },
        { id: 'main', name: 'อาหารหลัก', emoji: '🍛' },
        { id: 'dessert', name: 'ของหวาน', emoji: '🍰' },
        { id: 'drink', name: 'เครื่องดื่ม', emoji: '🥤' },
    ];

    return (
        <div className="sticky top-0 bg-white z-40 border-b border-gray-200">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex gap-2 py-4 overflow-x-auto">
                    {categories.map((category) => {
                        return (
                            <button
                                key={category.id}
                                onClick={() => onCategoryChange(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeCategory === category.id
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <span>{category.emoji}</span>
                                <span className="text-sm">{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Enhanced Food Item Component
const FoodItemCard: React.FC<{
    item: FoodItem;
    onAddToCart: (item: FoodItem) => void;
}> = ({ item, onAddToCart }) => {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        setTimeout(() => {
            onAddToCart(item);
            setIsAdding(false);
        }, 300);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex gap-4">
                <div className="text-5xl flex-shrink-0 relative">
                    {item.image}
                    {item.popular && (
                        <span className="absolute -top-1 -right-1 text-sm">🔥</span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                            <span className="truncate">{item.name}</span>
                            {item.popular && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                                    ฮิต
                                </span>
                            )}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Star size={12} className="fill-current text-yellow-400" />
                                <span>{item.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{item.cookTime}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-orange-600">
                            ฿{item.price.toLocaleString()}
                        </span>
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${isAdding
                                ? 'bg-green-500 text-white'
                                : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95'
                                }`}
                        >
                            {isAdding ? (
                                <>
                                    <Check size={16} />
                                    <span>เพิ่มแล้ว</span>
                                </>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    <span>เพิ่ม</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced Cart Modal Component
const CartModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onUpdateQuantity: (id: number, change: number) => void;
    onRemoveItem: (id: number) => void;
    onCheckout: () => void;
}> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
            <div className="bg-white w-full md:w-96 md:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-3">
                            <ShoppingCart size={24} />
                            ตะกร้าของฉัน ({totalItems})
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">ตะกร้าของคุณว่างเปล่า</p>
                            <p className="text-sm mt-2">เพิ่มอาหารที่ชื่นชอบเข้าตะกร้า</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl">{item.image}</div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-semibold text-gray-800 text-lg">{item.name}</h4>
                                                <button
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-full"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                                        className="bg-white hover:bg-gray-100 border-2 border-gray-200 rounded-full p-2 transition-colors hover:border-orange-300"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="font-bold text-lg min-w-[40px] text-center bg-white px-3 py-1 rounded-full">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                                        className="bg-white hover:bg-gray-100 border-2 border-gray-200 rounded-full p-2 transition-colors hover:border-orange-300"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                                    ฿{(item.price * item.quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <>
                        <div className="border-t border-gray-200 p-6 bg-gray-50">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xl font-semibold text-gray-800">ยอดรวม</span>
                                <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                    ฿{total.toLocaleString()}
                                </span>
                            </div>
                            <button
                                onClick={onCheckout}
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                            >
                                <CreditCard size={24} />
                                สั่งอาหาร ฿{total.toLocaleString()}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Enhanced Floating Cart Button
const FloatingCartButton: React.FC<{
    itemCount: number;
    total: number;
    onClick: () => void;
}> = ({ itemCount, total, onClick }) => {
    if (itemCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
            <button
                onClick={onClick}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl flex items-center gap-4 transition-all duration-300 hover:shadow-xl transform hover:scale-105"
            >
                <div className="relative">
                    <ShoppingCart size={24} />
                    <span className="absolute -top-3 -right-3 bg-white text-orange-600 text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center animate-bounce">
                        {itemCount}
                    </span>
                </div>
                <span className="hidden sm:inline text-lg">ดูตะกร้า</span>
                <span className="font-bold text-lg">฿{total.toLocaleString()}</span>
            </button>
        </div>
    );
};

// Main FoodMenu Component
const FoodMenu: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const filteredItems =
        activeCategory === 'all'
            ? mockFoodData
            : mockFoodData.filter(item => item.category === activeCategory);
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const addToCart = (foodItem: FoodItem) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === foodItem.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === foodItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...foodItem, quantity: 1 }];
        });
    };

    const updateQuantity = (id: number, change: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    const handleCheckoutComplete = () => {
        setCartItems([]);
        setIsCheckoutOpen(false);
    };

    // Auto-scroll to top when category changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeCategory]);
    return (
        <div className="min-h-screen bg-gray-50">
            {/* runner_game Header */}
            <runner_gameHeader />

            {/* Category Tabs */}
            <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            {/* Menu Items */}
            <div className="px-4 py-6 pb-24 max-w-2xl mx-auto">
                <div className="space-y-4">
                    {filteredItems.map(item => (
                        <FoodItemCard
                            key={item.id}
                            item={item}
                            onAddToCart={addToCart}
                        />
                    ))}
                </div>
            </div>

            {/* Floating Cart Button - Mobile Optimized */}
            <FloatingCartButton
                itemCount={totalItems}
                total={totalAmount}
                onClick={() => setIsCartOpen(true)}
            />

            {/* Cart Modal */}
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
            />

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={handleCheckoutComplete}
                cartItems={cartItems}
                total={totalAmount}
            />
        </div>
    );
};

export default FoodMenu;