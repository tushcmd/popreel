import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const OnboardingFlow = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = [
        { id: 1, name: "Comedy", description: "Funny videos and sketches" },
        { id: 2, name: "Music", description: "Songs, covers, and performances" },
        { id: 3, name: "Dance", description: "Choreography and dance moves" },
        { id: 4, name: "Education", description: "Learning and tutorials" },
        { id: 5, name: "Lifestyle", description: "Daily life and vlogs" },
        { id: 6, name: "Gaming", description: "Gaming content and streams" },
        { id: 7, name: "Food", description: "Cooking and food reviews" },
        { id: 8, name: "Fashion", description: "Style and beauty" }
    ];

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSubmit = async () => {
        try {
            // TODO: Implement API call to save preferences
            await fetch('/api/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categories: selectedCategories })
            });
            // TODO: Redirect to main feed
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    };

    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Welcome! Let's personalize your feed</CardTitle>
                        <CardDescription>
                            Select at least 3 categories that interest you
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => toggleCategory(category.id)}
                                    className={`relative p-4 rounded-lg border-2 text-left transition-all ${selectedCategories.includes(category.id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {selectedCategories.includes(category.id) && (
                                        <Check className="absolute w-4 h-4 text-blue-500 top-2 right-2" />
                                    )}
                                    <h3 className="font-medium">{category.name}</h3>
                                    <p className="text-sm text-gray-500">{category.description}</p>
                                </button>
                            ))}
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={selectedCategories.length < 3}
                            className="w-full mt-8"
                        >
                            Continue
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OnboardingFlow;