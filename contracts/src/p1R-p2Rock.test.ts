/* eslint-disable */
import { Field, Poseidon, Proof, isReady, shutdown } from 'snarkyjs';
import { rpsProgram } from './rpsProgram.js';
import { compareMoves, moveSet, rpsState } from './rpsHelpers.js';

describe('Player 1 (ROCK)', () => {
  let used: moveSet,
    p1Move: Field,
    p1Secret: Field,
    p1MoveHash: Field,
    p2Move: Field,
    p2State: rpsState,
    confirmState: rpsState,
    proof_p1SetMove: Proof<rpsState>,
    proof_p2SetMove: Proof<rpsState>,
    proof_setWinner: Proof<rpsState>;

  beforeAll(async () => {
    await isReady;

    used = new moveSet({
      Rock: Field(1),
      Paper: Field(2),
      Scissors: Field(3),
    });
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  it('Compiles zkProgram', async () => {
    await rpsProgram.compile();
  });

  it('Generates proof: P1 chooses Rock', async () => {
    p1Move = used.Rock;
    p1Secret = Field(24);

    p1MoveHash = Poseidon.hash([p1Move, p1Secret]);
    let p1State = {
      player1Choice: p1MoveHash, // set p1 move to secret hash
      player2Choice: Field(-1), // init state
      result: Field(-1), // init state
    };

    proof_p1SetMove = await rpsProgram.p1Move(p1State, p1Move, p1Secret);
  });

  it('Generates proof: P2 chooses Rock', async () => {
    p2Move = used.Rock;

    p2State = {
      player1Choice: proof_p1SetMove.publicInput.player1Choice, // from last proof
      player2Choice: p2Move, // set p2 move to public move
      result: proof_p1SetMove.publicInput.result, // from last proof
    };

    proof_p2SetMove = await rpsProgram.p2Move(p2State, p2Move, proof_p1SetMove);
  });

  it('Generates proof: P1 and P2 Tie', async () => {
    let result = compareMoves(p1Move, p2Move); // we find winner outside of zkProgram to set rpsState.result

    confirmState = {
      player1Choice: proof_p2SetMove.publicInput.player1Choice, // from last proof
      player2Choice: proof_p2SetMove.publicInput.player2Choice, // from last proof
      result: result, // set result to value returned from compareMoves()
    };

    proof_setWinner = await rpsProgram.checkWinner(
      confirmState,
      p1Move,
      p2Move,
      p1Secret,
      proof_p2SetMove
    );
  });

  it('Fails to generate proof: If P1 tries to win', async () => {
    let result = Field(1); // p1 wins

    confirmState = {
      player1Choice: proof_p2SetMove.publicInput.player1Choice,
      player2Choice: proof_p2SetMove.publicInput.player2Choice,
      result: result,
    };

    proof_setWinner = await rpsProgram
      .checkWinner(confirmState, p1Move, p2Move, p1Secret, proof_p2SetMove)
      .catch((e) => e);

    expect(proof_setWinner).rejects;
  });

  it('Fails to generate proof: If P2 tries to win', async () => {
    let result = Field(2); // p1 wins

    confirmState = {
      player1Choice: proof_p2SetMove.publicInput.player1Choice,
      player2Choice: proof_p2SetMove.publicInput.player2Choice,
      result: result,
    };

    proof_setWinner = await rpsProgram
      .checkWinner(confirmState, p1Move, p2Move, p1Secret, proof_p2SetMove)
      .catch((e) => e);

    expect(proof_setWinner).rejects;
  });
});
