package game

import "fmt"

type Board [][]intersection

type intersection int

// Player types
const (
	empty = intersection(iota)
	black
	white
)

func (b Board) set(m Move) error {
	if err := b.intersectionEmpty(m); err != nil {
		return err
	}
	b[m.X][m.Y] = intersection(m.Player)
	return nil
}

func (b Board) intersectionEmpty(m Move) error {
	i := b[m.X][m.Y]
	if i != empty {
		return fmt.Errorf("Intersection %d-%d is not empty", m.X, m.Y)
	}
	return nil
}
