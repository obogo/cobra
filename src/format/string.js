/* global cobra */
cobra.schemaFormat('trim', function (val, isTrim) {
    if (isTrim) {
        val = String(val).trim();
    }
    return val;
});
