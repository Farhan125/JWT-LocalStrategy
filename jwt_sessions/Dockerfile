FROM node:10.16.0



# Create app directory
WORKDIR /sails
ADD ./ /sails/
RUN chown -R node:node /sails/


CMD [ "node", "app.js" ]
