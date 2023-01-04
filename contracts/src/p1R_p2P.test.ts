/* eslint-disable */
import { Field, Poseidon, Proof, isReady, shutdown } from 'snarkyjs';
import { rpsProgram } from './rpsProgram.js';
import { rpsState } from './rpsHelpers.js';

describe('Player 1 (ROCK) vs Player 2 (PAPER)', () => {
  let p1Secret: Field,
    p1Move: Field,
    p1MoveHashed: Field,
    p1State: rpsState,
    p2Move: Field,
    p2State: rpsState,
    confirmState: rpsState,
    proofP1Moved: Proof<rpsState>,
    proofP2Moved: Proof<rpsState>,
    proofWinner: Proof<rpsState>;

  beforeAll(async () => {
    await isReady;
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  it('Compiles zkProgram', async () => {
    await rpsProgram.compile();
    rpsProgram.digest;
  });

  it('Proves P1 chooses rock', async () => {
    p1Move = Field(1); // rock

    p1Secret = Field(24);
    p1MoveHashed = Poseidon.hash([p1Move, p1Secret]);
    p1State = {
      player1Choice: p1MoveHashed,
      player2Choice: Field(-1),
      result: Field(-1),
    };

    proofP1Moved = await rpsProgram.p1Move(p1State, p1Move, p1Secret);
  });

  it('Proves P2 chooses paper', async () => {
    p2Move = Field(2); // paper

    p2State = {
      player1Choice: proofP1Moved.publicInput.player1Choice,
      player2Choice: p2Move,
      result: proofP1Moved.publicInput.result,
    };

    proofP2Moved = await rpsProgram.p2Move(p2State, p2Move, proofP1Moved);
  });

  it('Proves P2 wins because paper beats rock', async () => {
    let result = Field(2); // p2 wins

    confirmState = {
      player1Choice: proofP2Moved.publicInput.player1Choice,
      player2Choice: proofP2Moved.publicInput.player2Choice,
      result: result,
    };

    proofWinner = await rpsProgram.checkWinner(
      confirmState,
      p1Move,
      p2Move,
      p1Secret,
      proofP2Moved
    );
  });

  it('Throws error if P1 tries to wins', async () => {
    let result = Field(1); // p2 wins

    confirmState = {
      player1Choice: proofP2Moved.publicInput.player1Choice,
      player2Choice: proofP2Moved.publicInput.player2Choice,
      result: result,
    };

    proofWinner = await rpsProgram
      .checkWinner(confirmState, p1Move, p2Move, p1Secret, proofP2Moved)
      .catch((e) => e);

    expect(proofWinner).rejects;
  });
});
