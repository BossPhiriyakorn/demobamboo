# 📁 Image Folder Structure

This folder contains all images used in the Bamboo Platform application.

## 📂 Folder Organization

### `/avatars/`
- **Purpose**: User profile pictures and avatars
- **Formats**: JPG, PNG, WebP
- **Recommended size**: 200x200px or 400x400px
- **Usage**: Farmer profiles, admin profiles, factory profiles

### `/products/`
- **Purpose**: Product images and bamboo-related items
- **Formats**: JPG, PNG, WebP
- **Recommended size**: 800x600px or 1200x900px
- **Usage**: Bamboo products, equipment, tools

### `/articles/`
- **Purpose**: Images for knowledge base articles
- **Formats**: JPG, PNG, WebP
- **Recommended size**: 800x400px or 1200x600px
- **Usage**: Article thumbnails, content images

### `/icons/`
- **Purpose**: UI icons and small graphics
- **Formats**: SVG, PNG, ICO
- **Recommended size**: 16x16px to 64x64px
- **Usage**: Navigation icons, status indicators, buttons

### `/banners/`
- **Purpose**: Banner images and promotional graphics
- **Formats**: JPG, PNG, WebP
- **Recommended size**: 1200x300px or 1920x400px
- **Usage**: Homepage banners, promotional content

### `/logos/`
- **Purpose**: Company logos and branding
- **Formats**: SVG, PNG
- **Recommended size**: Various sizes (favicon, header, footer)
- **Usage**: Company branding, partner logos

### `/thumbnails/`
- **Purpose**: Small preview images
- **Formats**: JPG, PNG, WebP
- **Recommended size**: 150x150px or 300x300px
- **Usage**: Quick previews, gallery thumbnails

## 🚀 Usage in Code

### Importing Images
```typescript
// For static images
import logo from '/images/logos/bamboo-logo.png';
import avatar from '/images/avatars/default-avatar.png';

// For dynamic images
const imageUrl = `/images/products/${productId}.jpg`;
```

### In JSX
```jsx
<img src="/images/banners/homepage-banner.jpg" alt="Bamboo Platform" />
<img src={avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
```

## 📋 Naming Conventions

- Use lowercase letters and hyphens: `user-avatar.png`
- Be descriptive: `bamboo-harvesting-tools.jpg`
- Include version numbers if needed: `logo-v2.svg`
- Use consistent file extensions

## 🔧 Optimization Tips

1. **Compress images** before uploading
2. **Use WebP format** for better compression
3. **Provide multiple sizes** for responsive design
4. **Add alt text** for accessibility
5. **Use lazy loading** for better performance

## 📝 File Management

- Keep file sizes under 2MB for web performance
- Use descriptive filenames
- Organize by date or category if needed
- Regular cleanup of unused images
