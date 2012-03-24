#!/bin/bash
rm *.ipk
palm-package --use-v1-format release/
palm-install -d tcp *.ipk
palm-launch -d tcp com.tehtorq.redditlater-hb

