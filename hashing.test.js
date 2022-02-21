const hashing = require("./hashing");

const hash = "00005d430ce77ad654b5309a770350bfb4cf49171c682330a2eccc98fd8853cf"

const transactions = [
    {
        "_id": "5c5003d55c63d51f191cadd7",
        "from": "CMGT Mining Corporation",
        "to": "Bas BOOTB",
        "amount": 1,
        "timestamp": 1548747733261,
        "__v": 0
    }
]

const generalTimestamp = 1548748101396;

const testChunks =
    [
        [
            0, 0, 0, 0, 5,
            9, 7, 9, 8, 9
        ],
        [
            5, 9, 4, 9, 9,
            4, 9, 9, 6, 4
        ],
        [
            0, 1, 0, 0, 7,
            9, 1, 0, 1, 6
        ],
        [
            4, 5, 7, 4, 8,
            2, 5, 9, 8, 7
        ],
        [
            0, 1, 0, 0, 9,
            7, 1, 2, 0, 4
        ],
        [
            5, 9, 7, 1, 0,
            0, 9, 9, 0, 4
        ],
        [
            2, 1, 0, 1, 9,
            9, 2, 8, 9, 9
        ],
        [
            1, 9, 1, 0, 2,
            1, 0, 0, 9, 9
        ],
        [
            1, 0, 1, 1, 0,
            1, 9, 1, 0, 1
        ],
        [
            0, 9, 9, 8, 1,
            0, 0, 6, 6, 7
        ],
        [
            7, 7, 7, 1, 8,
            4, 7, 7, 1, 0
        ],
        [
            5, 1, 1, 0, 1,
            0, 5, 1, 1, 0
        ],
        [
            1, 0, 3, 6, 7,
            1, 1, 1, 1, 1
        ],
        [
            4, 1, 1, 2, 1,
            1, 1, 1, 1, 4
        ],
        [
            9, 7, 1, 1, 6,
            1, 0, 5, 1, 1
        ],
        [
            1, 1, 1, 0, 6,
            8, 9, 7, 1, 1
        ],
        [
            0, 1, 0, 5, 1,
            0, 1, 1, 0, 8
        ],
        [
            6, 5, 9, 8, 1,
            0, 0, 1, 0, 5
        ],
        [
            0, 9, 7, 5, 9,
            6, 3, 1, 1, 6
        ],
        [
            4, 5, 4, 7, 0,
            3, 2, 7, 4, 0
        ],
        [
            0, 1, 6, 4, 5,
            4, 7, 5, 9, 2
        ],
        [
            1, 0, 2, 2, 2,
            2, 3, 5, 0, 1
        ]
    ]

test("Chunk accumulation", () => {
    expect(hashing.handleChunkAccumulation(testChunks[0], testChunks, 1)).toEqual("0000105014c09d348efaec72b61e979961af90dac95742cf8aa982f6ed92089b")
})

test("Get the final nonce", () => {
    expect(hashing.getFinalNonce(hash, transactions[0], generalTimestamp)).toEqual(3926)
})

