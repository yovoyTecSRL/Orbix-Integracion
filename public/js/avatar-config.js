const AvatarConfig = {
    // Default avatar settings
    defaultAvatar: {
        size: 40,
        shape: 'circle', // 'circle' or 'square'
        backgroundColor: '#6c757d',
        textColor: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
    },

    // Size presets
    sizes: {
        small: 24,
        medium: 40,
        large: 64,
        xlarge: 96
    },

    // Color schemes
    colorSchemes: [
        { bg: '#007bff', text: '#ffffff' },
        { bg: '#28a745', text: '#ffffff' },
        { bg: '#dc3545', text: '#ffffff' },
        { bg: '#ffc107', text: '#000000' },
        { bg: '#17a2b8', text: '#ffffff' },
        { bg: '#6f42c1', text: '#ffffff' },
        { bg: '#e83e8c', text: '#ffffff' },
        { bg: '#fd7e14', text: '#ffffff' }
    ],

    // Avatar generation options
    options: {
        fallbackToInitials: true,
        maxInitials: 2,
        showBorder: false,
        borderWidth: 2,
        borderColor: '#dee2e6'
    },

    // Get initials from name
    getInitials: function(name) {
        if (!name) return '??';
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, this.options.maxInitials)
            .join('');
    },

    // Get random color scheme
    getRandomColor: function() {
        const randomIndex = Math.floor(Math.random() * this.colorSchemes.length);
        return this.colorSchemes[randomIndex];
    },

    // Generate avatar style
    generateStyle: function(name, size = 'medium', customColor = null) {
        const avatarSize = typeof size === 'number' ? size : this.sizes[size] || this.sizes.medium;
        const colors = customColor || this.getRandomColor();
        
        return {
            width: `${avatarSize}px`,
            height: `${avatarSize}px`,
            backgroundColor: colors.bg,
            color: colors.text,
            fontSize: `${Math.floor(avatarSize * 0.4)}px`,
            fontWeight: this.defaultAvatar.fontWeight,
            borderRadius: this.defaultAvatar.shape === 'circle' ? '50%' : '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: this.options.showBorder ? `${this.options.borderWidth}px solid ${this.options.borderColor}` : 'none'
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AvatarConfig;
}

// Make available globally
window.AvatarConfig = AvatarConfig;