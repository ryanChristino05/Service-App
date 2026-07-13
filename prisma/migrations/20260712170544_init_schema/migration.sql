-- CreateTable
CREATE TABLE `localisation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(11, 8) NOT NULL,
    `ville` VARCHAR(191) NOT NULL,
    `quartier` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `mot_de_passe` VARCHAR(255) NOT NULL,
    `role` ENUM('STANDARD', 'PRESTATAIRE') NOT NULL DEFAULT 'STANDARD',
    `photo_profil` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `telephone` VARCHAR(50) NULL,
    `localisation_id` INTEGER NOT NULL,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date_modification` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_localisation_id_idx`(`localisation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `icone` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prestataire_id` INTEGER NOT NULL,
    `categorie_id` INTEGER NOT NULL,
    `localisation_id` INTEGER NOT NULL,
    `titre` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `statut` ENUM('EN_ATTENTE', 'VALIDE', 'REFUSE') NOT NULL DEFAULT 'EN_ATTENTE',
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date_modification` DATETIME(3) NOT NULL,

    INDEX `service_categorie_id_idx`(`categorie_id`),
    INDEX `service_localisation_id_idx`(`localisation_id`),
    INDEX `service_statut_idx`(`statut`),
    INDEX `service_prestataire_id_idx`(`prestataire_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `service_id` INTEGER NOT NULL,
    `url_image` VARCHAR(255) NOT NULL,
    `ordre` INTEGER NULL,

    INDEX `service_image_service_id_idx`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `service_id` INTEGER NOT NULL,
    `auteur_id` INTEGER NOT NULL,
    `note` INTEGER NULL,
    `commentaire` TEXT NULL,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `feedback_service_id_idx`(`service_id`),
    UNIQUE INDEX `unique_feedback`(`service_id`, `auteur_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annonce` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `demandeur_id` INTEGER NOT NULL,
    `categorie_id` INTEGER NOT NULL,
    `localisation_id` INTEGER NOT NULL,
    `titre` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `statut` ENUM('ACTIVE', 'EN_COURS', 'RESOLUE', 'EXPIREE') NOT NULL DEFAULT 'ACTIVE',
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date_expiration` DATETIME(3) NULL,

    INDEX `annonce_categorie_id_idx`(`categorie_id`),
    INDEX `annonce_localisation_id_idx`(`localisation_id`),
    INDEX `annonce_demandeur_id_idx`(`demandeur_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proposition_annonce` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `annonce_id` INTEGER NOT NULL,
    `utilisateur_id` INTEGER NOT NULL,
    `message` VARCHAR(191) NULL,
    `statut` ENUM('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE') NOT NULL DEFAULT 'EN_ATTENTE',
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `proposition_annonce_annonce_id_idx`(`annonce_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `type` ENUM('DEMANDE', 'FEEDBACK', 'SERVICE_VALIDE', 'SERVICE_REFUSE') NULL,
    `titre` VARCHAR(191) NULL,
    `contenu` VARCHAR(191) NULL,
    `vu` BOOLEAN NOT NULL DEFAULT false,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notification_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_localisation_id_fkey` FOREIGN KEY (`localisation_id`) REFERENCES `localisation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_prestataire_id_fkey` FOREIGN KEY (`prestataire_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_categorie_id_fkey` FOREIGN KEY (`categorie_id`) REFERENCES `categorie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_localisation_id_fkey` FOREIGN KEY (`localisation_id`) REFERENCES `localisation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_image` ADD CONSTRAINT `service_image_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_auteur_id_fkey` FOREIGN KEY (`auteur_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annonce` ADD CONSTRAINT `annonce_demandeur_id_fkey` FOREIGN KEY (`demandeur_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annonce` ADD CONSTRAINT `annonce_categorie_id_fkey` FOREIGN KEY (`categorie_id`) REFERENCES `categorie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annonce` ADD CONSTRAINT `annonce_localisation_id_fkey` FOREIGN KEY (`localisation_id`) REFERENCES `localisation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposition_annonce` ADD CONSTRAINT `proposition_annonce_annonce_id_fkey` FOREIGN KEY (`annonce_id`) REFERENCES `annonce`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposition_annonce` ADD CONSTRAINT `proposition_annonce_utilisateur_id_fkey` FOREIGN KEY (`utilisateur_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
