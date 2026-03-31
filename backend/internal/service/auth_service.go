package service

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/uaad/backend/internal/domain"
	"github.com/uaad/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrUserAlreadyExists = errors.New("user already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type AuthService interface {
	Register(phone, username, password string) error
	Login(phone, password string) (string, error)
}

type authService struct {
	repo   repository.UserRepository
	secret []byte
}

func NewAuthService(repo repository.UserRepository, secret string) AuthService {
	return &authService{
		repo:   repo,
		secret: []byte(secret),
	}
}

func (s *authService) Register(phone, username, password string) error {
	// Check if exists
	_, err := s.repo.FindByPhone(phone)
	if err == nil {
		return ErrUserAlreadyExists
	}

	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &domain.User{
		Phone:        phone,
		Username:     username,
		PasswordHash: string(hash),
	}

	return s.repo.Create(user)
}

func (s *authService) Login(phone, password string) (string, error) {
	user, err := s.repo.FindByPhone(phone)
	if err != nil {
		return "", ErrInvalidCredentials
	}

	// Compare password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", ErrInvalidCredentials
	}

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString(s.secret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
