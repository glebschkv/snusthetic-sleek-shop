import { Button } from '@/components/ui/button';
import { Category } from '@/types/store';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categorySlug: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.slug ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category.slug)}
          className="min-w-[100px]"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;