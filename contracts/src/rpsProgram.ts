/* eslint-disable */
import {
  Circuit,
  Experimental,
  Field,
  Poseidon,
  SelfProof,
  Struct,
} from 'snarkyjs';
import { rpsState } from './rpsHelpers';

export const rpsProgram = Experimental.ZkProgram({
  publicInput: rpsState,
  methods: {
    p1Move: {
      privateInputs: [Field, Field],
      method(publicInput: rpsState, move: Field, secret: Field) {
        // assert valid start state:
        publicInput.player2Choice.assertEquals(Field(-1));
        publicInput.result.assertEquals(Field(-1));

        // assert move choice is within range:
        move.assertGte(Field(1));
        move.assertLte(Field(3));

        // p1 makes a valid move:
        publicInput.player1Choice.assertEquals(Poseidon.hash([move, secret]));
      },
    },

    p2Move: {
      privateInputs: [Field, SelfProof],
      method(
        publicInput: rpsState,
        move: Field,
        prevProof: SelfProof<rpsState>
      ) {
        // verify p1 move is valid:
        prevProof.verify();
        publicInput.player1Choice.assertEquals(
          prevProof.publicInput.player1Choice
        );

        // assert move choice is within range:
        move.assertGte(Field(1));
        move.assertLte(Field(3));

        // p2 makes a valid move
        publicInput.player2Choice.assertEquals(move);
      },
    },

    checkWinner: {
      privateInputs: [Field, Field, Field, SelfProof],
      method(
        publicInput: rpsState,
        confirmP1Move: Field,
        confirmP2Move: Field,
        secret: Field,
        prevProof: SelfProof<rpsState>
      ) {
        prevProof.verify();
        // Assert p1 move has NOT been altered:

        // 1. Assert current p1 choice has not changed from last proof
        publicInput.player1Choice.assertEquals(
          prevProof.publicInput.player1Choice
        );
        // 2. confirm Field move provided corresponds to current p1 choice
        let confirmed = Poseidon.hash([confirmP1Move, secret]);
        publicInput.player1Choice.assertEquals(confirmed);

        // Assert p1 is NOT altering the move p2 provided:
        confirmP2Move.assertEquals(prevProof.publicInput.player2Choice);

        // TODO: compare publicInput.player2choice with confirmMove & secret
        let theWinner = Circuit.if(
          // if p1 = rock and p2 = paper,
          confirmP1Move.equals(Field(1)).and(confirmP2Move.equals(Field(2))),
          // p2 wins
          Field(2),
          // else assume p2 = scissors and p1 wins
          Field(1)
        );
        publicInput.result.assertEquals(theWinner);
      },
    },
  },
});
