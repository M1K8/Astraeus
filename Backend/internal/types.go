package types

// Platform is an enum denoting games platform.
type Platform string

//AccountType is an enum denoting the type of linked account.
type AccountType string

const (
	// XX - enum for cross platform.
	XX Platform = "XX"

	// PC - enum for PC gamers.
	PC Platform = "PC"

	// XBL - enum for Xbox gamers.
	XBL Platform = "XBL"

	// PSN - enum for PlayStation gamers.
	PSN Platform = "PSX"

	// NX - enum for Switch gamers.
	NX Platform = "Switch"

	// TW - account type for Twitter.
	TW AccountType = "Twitter"

	// DC - account type for Discord.
	DC AccountType = "Discord"

	// FB - account type for Facebook (lol).
	FB AccountType = "Facebook"
)

// User is a struct representing user data.
type User struct {
	uid             []byte
	username        string
	primaryPlatform Platform
	platforms       *[]Platform
	flocks          *[]Flock
	friends         []User
	primaryAccount  *Account
	linkedAccounts  *[]Account
	verified        bool
}

// Flock is a struct representing a group of Users.
type Flock struct {
	uid     []byte
	owner   User
	members []User
}

// Account represents a generalised view of a linked account.
type Account struct {
	accType  AccountType
	isPublic bool
}
