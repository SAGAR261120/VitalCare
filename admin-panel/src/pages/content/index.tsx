import { ContentManagePage } from '../ContentManagePage';

export const BannersPage = () => (
  <ContentManagePage title="Banners" resource="banners"
    columns={[{ key: 'title', label: 'Title' }, { key: 'placement', label: 'Placement' }]}
    fields={[
      { key: 'title', label: 'Title' }, { key: 'subtitle', label: 'Subtitle' },
      { key: 'placement', label: 'Placement (home/promo)' }, { key: 'sortOrder', label: 'Sort Order', type: 'number' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ]} />
);

export const HealthPackagesPage = () => (
  <ContentManagePage title="Health Packages" resource="health-packages"
    columns={[{ key: 'name', label: 'Name' }, { key: 'price', label: 'Price' }, { key: 'testCount', label: 'Tests' }]}
    fields={[
      { key: 'name', label: 'Name' }, { key: 'description', label: 'Description', multiline: true },
      { key: 'testCount', label: 'Test Count', type: 'number' }, { key: 'price', label: 'Price', type: 'number' },
      { key: 'originalPrice', label: 'Original Price', type: 'number' }, { key: 'discount', label: 'Discount %', type: 'number' },
      { key: 'badge', label: 'Badge' }, { key: 'isFeatured', label: 'Featured', type: 'boolean' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ]} />
);

export const SpecialistsPage = () => (
  <ContentManagePage title="Specialists" resource="specialists"
    columns={[{ key: 'name', label: 'Name' }, { key: 'specialty', label: 'Specialty' }, { key: 'rating', label: 'Rating' }]}
    fields={[
      { key: 'name', label: 'Name' }, { key: 'specialty', label: 'Specialty' },
      { key: 'experience', label: 'Experience' }, { key: 'rating', label: 'Rating', type: 'number' },
      { key: 'hospital', label: 'Hospital' }, { key: 'isFeatured', label: 'Featured', type: 'boolean' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ]} />
);

export const MembershipPlansPage = () => (
  <ContentManagePage title="Membership Plans" resource="membership-plans"
    columns={[{ key: 'name', label: 'Name' }, { key: 'tier', label: 'Tier' }, { key: 'price', label: 'Price' }]}
    fields={[
      { key: 'name', label: 'Name' }, { key: 'tier', label: 'Tier (NATIONAL/GLOBAL)' },
      { key: 'validity', label: 'Validity' }, { key: 'price', label: 'Price', type: 'number' },
      { key: 'originalPrice', label: 'Original Price', type: 'number' }, { key: 'badge', label: 'Badge' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ]} />
);

export const InsurancePlansPage = () => (
  <ContentManagePage title="Insurance Plans" resource="insurance-plans"
    columns={[{ key: 'provider', label: 'Provider' }, { key: 'name', label: 'Plan' }, { key: 'premium', label: 'Premium' }]}
    fields={[
      { key: 'provider', label: 'Provider' }, { key: 'name', label: 'Plan Name' },
      { key: 'description', label: 'Description', multiline: true },
      { key: 'coverage', label: 'Coverage', type: 'number' }, { key: 'premium', label: 'Premium', type: 'number' },
      { key: 'tenure', label: 'Tenure' }, { key: 'recommended', label: 'Recommended', type: 'boolean' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ]} />
);

export const CategoriesPage = () => (
  <ContentManagePage title="Categories" resource="categories"
    columns={[{ key: 'name', label: 'Name' }, { key: 'slug', label: 'Slug' }]}
    fields={[
      { key: 'name', label: 'Name' }, { key: 'slug', label: 'Slug' },
      { key: 'icon', label: 'Icon' }, { key: 'sortOrder', label: 'Sort Order', type: 'number' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ]} />
);

export const OnboardingPage = () => (
  <ContentManagePage title="Onboarding Slides" resource="onboarding-slides"
    columns={[{ key: 'title', label: 'Title' }, { key: 'icon', label: 'Icon' }]}
    fields={[
      { key: 'title', label: 'Title' }, { key: 'subtitle', label: 'Subtitle', multiline: true },
      { key: 'icon', label: 'Icon Name' }, { key: 'sortOrder', label: 'Sort Order', type: 'number' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ]} />
);

export const RewardsManagePage = () => (
  <ContentManagePage title="Reward Tasks" resource="rewards"
    columns={[{ key: 'title', label: 'Title' }, { key: 'points', label: 'Points' }]}
    fields={[
      { key: 'title', label: 'Title' }, { key: 'description', label: 'Description' },
      { key: 'points', label: 'Points', type: 'number' }, { key: 'icon', label: 'Icon' },
      { key: 'isActive', label: 'Active', type: 'boolean' },
    ]} />
);
