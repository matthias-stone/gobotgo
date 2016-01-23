// Package game provides means of playing a game
package game

type State struct {
	current  Board
	previous Board
	player   player
	size     int
}

func New(size int) State {
	c := newBoard(size)
	p := newBoard(size)
	return State{
		current:  c,
		previous: p,
		player:   Black,
		size:     size,
	}
}

func (s State) Move(m Move) error {
	if err := m.valid(s.size, s.player); err != nil {
		return err
	}
	b := s.current.copy()
	if err := b.set(m); err != nil {
		return err
	}
	s.previous = s.current
	s.current = b
	return nil
}
